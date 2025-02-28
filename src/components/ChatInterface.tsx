
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Lock, LockOpen, Users } from 'lucide-react';
import { encryptMessage, decryptMessage } from './EncryptionUtils';
import MessageDisplay from './MessageDisplay';
import NeonButton from './ui-elements/NeonButton';
import SecretKeyInput from './SecretKeyInput';
import HolographicCard from './ui-elements/HolographicCard';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isDecrypted: boolean;
  room_key: string;
}

interface ChatInterfaceProps {
  initialSecretKey?: string;
}

// Generate a random username for this session
const generateUsername = () => {
  const prefixes = ['Agent', 'Nexus', 'Cipher', 'Vector', 'Nova', 'Echo', 'Pulse', 'Quantum', 'Delta', 'Shadow'];
  const suffixes = ['X', 'Z', '7', '9', 'Alpha', 'Prime', 'Zero', 'Omega', 'Phoenix', 'Spectre'];
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${randomPrefix}_${randomSuffix}`;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialSecretKey = '' }) => {
  const [secretKey, setSecretKey] = useState<string>(initialSecretKey);
  const [hasEnteredKey, setHasEnteredKey] = useState<boolean>(!!initialSecretKey);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [decryptingMessageId, setDecryptingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser] = useState<string>(generateUsername());
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check if Supabase is properly configured on component mount
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Try a simple query to check connection
        const { error } = await supabase.from('messages').select('count', { count: 'exact', head: true });
        
        if (error && (error.message.includes('Failed to fetch') || error.message.includes('Network error'))) {
          setSupabaseConnected(false);
          toast({
            title: "Connection Issue",
            description: "Could not connect to the database. Using local mode only.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Supabase connection check failed:', error);
        setSupabaseConnected(false);
        toast({
          title: "Connection Issue",
          description: "Could not connect to the database. Using local mode only.",
          variant: "destructive",
        });
      }
    };
    
    checkSupabaseConnection();
  }, [toast]);
  
  // Setup Supabase subscription when secret key changes
  useEffect(() => {
    if (!secretKey || !supabaseConnected) return;
    
    // First, fetch existing messages for this room
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_key', secretKey)
          .order('timestamp', { ascending: true });
        
        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again.",
            variant: "destructive",
          });
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    fetchMessages();
    
    // Then subscribe to new messages
    const subscription = supabase
      .channel(`room_${secretKey}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_key=eq.${secretKey}`,
      }, (payload) => {
        // Add new message to state
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .subscribe();
    
    // Add user presence
    const addUserPresence = async () => {
      try {
        // Check if room exists
        const { data: roomData } = await supabase
          .from('rooms')
          .select('*')
          .eq('key', secretKey)
          .single();
        
        if (!roomData) {
          // Create room if it doesn't exist
          await supabase
            .from('rooms')
            .insert({ key: secretKey, created_by: currentUser });
        }
        
        // Add user to room users
        await supabase
          .from('room_users')
          .upsert({ 
            room_key: secretKey, 
            username: currentUser, 
            last_active: new Date().toISOString() 
          });
        
        // Add join message
        const joinMessage = {
          id: crypto.randomUUID(),
          sender: 'System',
          content: encryptMessage(`${currentUser} has joined the chat.`, secretKey),
          timestamp: new Date().toISOString(),
          room_key: secretKey
        };
        
        await supabase.from('messages').insert(joinMessage);
      } catch (error) {
        console.error('Error adding user presence:', error);
      }
    };
    
    addUserPresence();
    
    // Subscribe to room users
    const userSubscription = supabase
      .channel(`room_users_${secretKey}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_users',
        filter: `room_key=eq.${secretKey}`,
      }, () => {
        // Fetch latest list of users
        fetchRoomUsers();
      })
      .subscribe();
    
    // Fetch room users initially
    const fetchRoomUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('room_users')
          .select('username')
          .eq('room_key', secretKey)
          .gte('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Active in last 5 minutes
        
        if (error) {
          console.error('Error fetching users:', error);
        } else {
          setUsersInRoom(data.map(user => user.username));
        }
      } catch (error) {
        console.error('User fetch error:', error);
      }
    };
    
    fetchRoomUsers();
    
    // Update user's last active timestamp every minute
    const keepAliveInterval = setInterval(async () => {
      await supabase
        .from('room_users')
        .upsert({ 
          room_key: secretKey, 
          username: currentUser, 
          last_active: new Date().toISOString() 
        });
    }, 60 * 1000);
    
    // Clean up when component unmounts or key changes
    return () => {
      subscription.unsubscribe();
      userSubscription.unsubscribe();
      clearInterval(keepAliveInterval);
      
      // Remove user from room
      const removeUser = async () => {
        try {
          // Add leave message
          const leaveMessage = {
            id: crypto.randomUUID(),
            sender: 'System',
            content: encryptMessage(`${currentUser} has left the chat.`, secretKey),
            timestamp: new Date().toISOString(),
            room_key: secretKey
          };
          
          await supabase.from('messages').insert(leaveMessage);
        } catch (error) {
          console.error('Error adding leave message:', error);
        }
      };
      
      removeUser();
    };
  }, [secretKey, currentUser, toast, supabaseConnected]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeySubmit = (key: string) => {
    setSecretKey(key);
    setHasEnteredKey(true);
    
    toast({
      title: "Key Activated",
      description: "Your secret key has been set. You can now send encrypted messages.",
      variant: "default",
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && secretKey) {
      const encryptedContent = encryptMessage(message.trim(), secretKey);
      const newMessage = {
        id: crypto.randomUUID(),
        sender: currentUser,
        content: encryptedContent,
        timestamp: new Date().toISOString(),
        room_key: secretKey
      };
      
      if (supabaseConnected) {
        try {
          // Send message to Supabase
          const { error } = await supabase.from('messages').insert(newMessage);
          
          if (error) {
            console.error('Error sending message:', error);
            toast({
              title: "Message Failed",
              description: "Could not send your message. Please try again.",
              variant: "destructive",
            });
          } else {
            setMessage('');
          }
        } catch (error) {
          console.error('Send error:', error);
          toast({
            title: "Message Failed",
            description: "Could not send your message. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // If Supabase is not connected, just add to local state
        setMessages(prev => [...prev, {...newMessage, isDecrypted: false}]);
        setMessage('');
      }
    }
  };

  const handleDecryptMessage = (messageId: string) => {
    setDecryptingMessageId(messageId);
    
    // After decryption animation completes, mark message as decrypted
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? {...msg, isDecrypted: true} : msg
        )
      );
      setDecryptingMessageId(null);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <HolographicCard className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageCircle className="mr-2 text-neon-blue" size={24} />
            <h1 className="text-2xl neon-blue-text">SecretChat</h1>
          </div>
          <div className="flex items-center">
            {hasEnteredKey ? (
              <span className="flex items-center text-green-400 mr-4">
                <LockOpen size={16} className="mr-1" /> Secure Key Active
              </span>
            ) : (
              <span className="flex items-center text-yellow-400 mr-4">
                <Lock size={16} className="mr-1" /> No Secure Key
              </span>
            )}
            {hasEnteredKey && (
              <span className="flex items-center text-neon-purple">
                <Users size={16} className="mr-1" /> {usersInRoom.length} Online
              </span>
            )}
          </div>
        </div>
        
        {!supabaseConnected && (
          <div className="bg-red-900 bg-opacity-30 text-red-300 p-2 mb-4 rounded border border-red-600">
            <p className="text-sm">
              ⚠️ Database connection issue. Running in local mode only. Messages won't be saved or shared with others.
            </p>
          </div>
        )}
        
        {!hasEnteredKey ? (
          <SecretKeyInput onSubmit={handleKeySubmit} buttonText="Activate Key" initialValue={initialSecretKey} />
        ) : (
          <>
            <div className="bg-dark-bg rounded-md p-4 mb-4 h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`${msg.sender === currentUser ? 'ml-auto' : ''} max-w-[80%]`}
                    >
                      <MessageDisplay
                        encryptedMessage={msg.content}
                        secretKey={secretKey}
                        sender={msg.sender}
                        timestamp={new Date(msg.timestamp).toLocaleTimeString()}
                        isDecrypting={decryptingMessageId === msg.id}
                      />
                      
                      {(!msg.isDecrypted && decryptingMessageId !== msg.id) && (
                        <div className="flex justify-end mt-1">
                          <button
                            className="text-xs text-neon-blue hover:text-neon-purple transition-colors"
                            onClick={() => handleDecryptMessage(msg.id)}
                          >
                            Decrypt Message
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {usersInRoom.length > 0 && (
              <div className="flex flex-wrap mb-4 gap-2">
                {usersInRoom.map(user => (
                  <span 
                    key={user} 
                    className={`text-xs px-2 py-1 rounded ${
                      user === currentUser 
                        ? 'bg-neon-blue bg-opacity-20 text-neon-blue' 
                        : 'bg-neon-purple bg-opacity-20 text-neon-purple'
                    }`}
                  >
                    {user}
                  </span>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your encrypted message..."
                className="flex-1 bg-dark-bg border border-neon-purple rounded-md px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(30,174,219,0.3)] transition-all duration-300"
              />
              <NeonButton 
                type="submit" 
                variant="pink" 
                disabled={!message.trim() || !secretKey}
                className="flex items-center justify-center"
              >
                <Send size={16} className="mr-2" />
                Send
              </NeonButton>
            </form>
          </>
        )}
      </HolographicCard>
    </div>
  );
};

export default ChatInterface;
