
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Lock, LockOpen } from 'lucide-react';
import { encryptMessage } from './EncryptionUtils';
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

const ChatInterface: React.FC = () => {
  const [secretKey, setSecretKey] = useState<string>('');
  const [hasEnteredKey, setHasEnteredKey] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [decryptingMessageId, setDecryptingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample usernames for demo
  const currentUser = "Agent_X";
  const otherUser = "Nexus_9";

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // For demo purposes, add some sample messages
  useEffect(() => {
    if (messages.length === 0) {
      const demoMessages = [
        {
          id: '1',
          sender: otherUser,
          content: encryptMessage("Welcome to SecretChat. Communications are encrypted.", "demo"),
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
          isDecrypted: false
        },
        {
          id: '2',
          sender: otherUser,
          content: encryptMessage("Use the same secret key to decrypt messages.", "demo"),
          timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
          isDecrypted: false
        }
      ];
      setMessages(demoMessages);
    }
  }, []);

  const handleKeySubmit = (key: string) => {
    setSecretKey(key);
    setHasEnteredKey(true);
    toast({
      title: "Key Activated",
      description: "Your secret key has been set. You can now send encrypted messages.",
      variant: "default",
    });
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
      
      setMessages([...messages, newMessage]);
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
              <span className="flex items-center text-green-400">
                <LockOpen size={16} className="mr-1" /> Secure Key Active
              </span>
            ) : (
              <span className="flex items-center text-yellow-400">
                <Lock size={16} className="mr-1" /> No Secure Key
              </span>
            )}
          </div>
        </div>
        
        {!hasEnteredKey ? (
          <SecretKeyInput onSubmit={handleKeySubmit} buttonText="Activate Key" />
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
