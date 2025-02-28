
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Lock, LockOpen, Users } from 'lucide-react';
import { encryptMessage, decryptMessage } from './EncryptionUtils';
import MessageDisplay from './MessageDisplay';
import NeonButton from './ui-elements/NeonButton';
import SecretKeyInput from './SecretKeyInput';
import HolographicCard from './ui-elements/HolographicCard';
import GlitchText from './ui-elements/GlitchText';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isDecrypted: boolean;
}

interface ChatInterfaceProps {
  initialSecretKey?: string;
}

// Simulated database of chat rooms
const chatRooms: Record<string, Message[]> = {};

// Active users in each room
const activeUsers: Record<string, string[]> = {};

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
  const { toast } = useToast();
  
  // Poll for new messages in the room
  useEffect(() => {
    if (!secretKey) return;
    
    // Initialize room if it doesn't exist
    if (!chatRooms[secretKey]) {
      chatRooms[secretKey] = [];
    }
    
    // Add welcome message if room is empty
    if (chatRooms[secretKey].length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        sender: 'System',
        content: encryptMessage("Welcome to SecretChat. Communications are encrypted.", secretKey),
        timestamp: new Date().toLocaleTimeString(),
        isDecrypted: false
      };
      chatRooms[secretKey].push(welcomeMessage);
    }
    
    // Add user to room
    if (!activeUsers[secretKey]) {
      activeUsers[secretKey] = [];
    }
    
    if (!activeUsers[secretKey].includes(currentUser)) {
      activeUsers[secretKey].push(currentUser);
    }
    
    // Update local messages and users
    setMessages([...chatRooms[secretKey]]);
    setUsersInRoom([...activeUsers[secretKey]]);
    
    // Set up polling interval to check for new messages
    const interval = setInterval(() => {
      setMessages([...chatRooms[secretKey]]);
      setUsersInRoom([...activeUsers[secretKey]]);
    }, 1000);
    
    // Clean up when component unmounts or key changes
    return () => {
      clearInterval(interval);
      
      // Remove user from room when leaving
      if (secretKey && activeUsers[secretKey]) {
        const index = activeUsers[secretKey].indexOf(currentUser);
        if (index !== -1) {
          activeUsers[secretKey].splice(index, 1);
        }
      }
    };
  }, [secretKey, currentUser]);

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
    
    // Join notification
    const joinMessage = {
      id: Date.now().toString(),
      sender: 'System',
      content: encryptMessage(`${currentUser} has joined the chat.`, key),
      timestamp: new Date().toLocaleTimeString(),
      isDecrypted: false
    };
    
    if (!chatRooms[key]) {
      chatRooms[key] = [];
    }
    
    chatRooms[key].push(joinMessage);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && secretKey) {
      const encryptedContent = encryptMessage(message.trim(), secretKey);
      const newMessage = {
        id: Date.now().toString(),
        sender: currentUser,
        content: encryptedContent,
        timestamp: new Date().toLocaleTimeString(),
        isDecrypted: false
      };
      
      // Add message to the room
      chatRooms[secretKey].push(newMessage);
      
      // Update local state
      setMessages([...chatRooms[secretKey]]);
      setMessage('');
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
                        timestamp={msg.timestamp}
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
