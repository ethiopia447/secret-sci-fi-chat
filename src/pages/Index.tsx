
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import ChatInterface from '@/components/ChatInterface';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

interface IndexProps {
  session: any;
}

const Index: React.FC<IndexProps> = ({ session }) => {
  const [secretKey, setSecretKey] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleEnterChat = (key: string) => {
    setSecretKey(key);
    setShowChat(true);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen bg-dark-bg p-4">
      {/* Auth controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-neon-blue">
              {session.user.email || 'Authenticated User'}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-1">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')} variant="outline" size="sm" className="flex items-center gap-1">
            <UserCircle size={16} />
            Login
          </Button>
        )}
      </div>
      
      {showChat ? (
        <ChatInterface initialSecretKey={secretKey} />
      ) : (
        <LandingPage onEnterChat={handleEnterChat} />
      )}
    </div>
  );
};

export default Index;
