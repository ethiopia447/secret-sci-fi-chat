
import React, { useState, useEffect } from 'react';
import { Lock, MessageCircle, Shield } from 'lucide-react';
import NeonButton from './ui-elements/NeonButton';
import HolographicCard from './ui-elements/HolographicCard';
import GlitchText from './ui-elements/GlitchText';
import SecretKeyInput from './SecretKeyInput';

interface LandingPageProps {
  onEnterChat: (secretKey: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterChat }) => {
  const [loadingText, setLoadingText] = useState('Initializing Secure Connection');
  const [showContent, setShowContent] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    // Simulate initializing sequence
    const loadingMessages = [
      'Initializing Secure Connection',
      'Checking Encryption Protocols',
      'Establishing Secure Channel',
      'Scanning for Surveillance',
      'Connection Secured'
    ];
    
    loadingMessages.forEach((message, index) => {
      setTimeout(() => {
        setLoadingText(message);
        if (index === loadingMessages.length - 1) {
          setTimeout(() => {
            setShowContent(true);
            setTimeout(() => setAnimationDone(true), 1000);
          }, 500);
        }
      }, 1000 * index);
    });
  }, []);

  const handleKeySubmit = (key: string) => {
    onEnterChat(key);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Loading animation */}
      {!showContent && (
        <div className="text-center">
          <div className="inline-block animate-pulse-glow p-4 rounded-full mb-6">
            <Lock size={50} className="text-neon-purple" />
          </div>
          <h2 className="text-2xl mb-4 neon-text animate-pulse">
            <GlitchText text={loadingText} />
          </h2>
          <div className="w-64 h-2 bg-dark-accent rounded-full overflow-hidden">
            <div className="h-full bg-neon-purple animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      {showContent && (
        <div className={`max-w-4xl w-full mx-auto transition-opacity duration-1000 ${animationDone ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md bg-neon-purple opacity-20 animate-pulse-glow"></div>
                <Lock size={80} className="text-neon-purple relative z-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="neon-text">Secret</span>
              <span className="neon-blue-text">Chat</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Encrypted communication with dramatic decryption animations. 
              Use the same secret key to encrypt and decrypt messages.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <HolographicCard className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center border border-neon-purple">
                  <Lock size={24} className="text-neon-purple" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text">End-to-End Encryption</h3>
              <p className="text-gray-400">Messages are encrypted before being sent and can only be decrypted with the correct key.</p>
            </HolographicCard>
            
            <HolographicCard className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center border border-neon-blue">
                  <MessageCircle size={24} className="text-neon-blue" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-blue-text">Secure Messaging</h3>
              <p className="text-gray-400">Chat with confidence knowing your communications are protected from prying eyes.</p>
            </HolographicCard>
            
            <HolographicCard className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center border border-neon-pink">
                  <Shield size={24} className="text-neon-pink" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 neon-pink-text">Visual Cryptography</h3>
              <p className="text-gray-400">Experience dramatic decryption animations as your messages are revealed.</p>
            </HolographicCard>
          </div>
          
          {/* Access form */}
          <div className="mb-8">
            <h2 className="text-2xl text-center neon-blue-text mb-6">Enter Secret Key to Access</h2>
            <SecretKeyInput 
              onSubmit={handleKeySubmit} 
              buttonText="Enter Chat" 
              placeholder="Create or enter a secret key..."
            />
            <p className="text-center text-gray-400 mt-4 text-sm">
              For demonstration purposes, use any key you want.
              <br />In a real system, you would need to share this key with your recipient through a secure channel.
            </p>
          </div>
          
          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p className="animate-flicker">⚠️ SecretChat is for demonstration purposes only ⚠️</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
