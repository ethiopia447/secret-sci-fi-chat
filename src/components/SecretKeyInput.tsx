
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import NeonButton from './ui-elements/NeonButton';

interface SecretKeyInputProps {
  onSubmit: (key: string) => void;
  buttonText?: string;
  initialValue?: string;
  placeholder?: string;
}

const SecretKeyInput: React.FC<SecretKeyInputProps> = ({ 
  onSubmit, 
  buttonText = "Submit", 
  initialValue = "",
  placeholder = "Enter your secret key"
}) => {
  const [key, setKey] = useState<string>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-dark-bg bg-opacity-80 rounded-lg p-6 border border-neon-purple">
        <div className="flex items-center mb-4">
          <Lock className="text-neon-pink mr-2" size={20} />
          <h2 className="text-xl text-neon-pink">Enter Secret Key</h2>
        </div>
        <p className="text-gray-300 mb-6">
          To join a secure chat room, enter a secret key. Others with the same key can join this encrypted channel.
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-dark-card border border-neon-purple rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(30,174,219,0.3)] transition-all duration-300"
          />
          <div className="flex justify-end">
            <NeonButton 
              type="submit" 
              disabled={!key.trim()}
              className="w-full sm:w-auto"
            >
              {buttonText}
            </NeonButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SecretKeyInput;
