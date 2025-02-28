
import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [secretKey, setSecretKey] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false);
  
  const handleEnterChat = (key: string) => {
    setSecretKey(key);
    setShowChat(true);
  };
  
  return (
    <div className="min-h-screen bg-dark-bg p-4">
      {showChat ? (
        <ChatInterface />
      ) : (
        <LandingPage onEnterChat={handleEnterChat} />
      )}
    </div>
  );
};

export default Index;
