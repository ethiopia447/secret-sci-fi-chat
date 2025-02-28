
import React, { useState } from 'react';
import { Lock, Key } from 'lucide-react';
import NeonButton from './ui-elements/NeonButton';
import HolographicCard from './ui-elements/HolographicCard';

interface SecretKeyInputProps {
  onSubmit: (secretKey: string) => void;
  buttonText?: string;
  placeholder?: string;
}

const SecretKeyInput: React.FC<SecretKeyInputProps> = ({
  onSubmit,
  buttonText = "Enter",
  placeholder = "Enter secret key"
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim()) {
      onSubmit(secretKey.trim());
    }
  };

  return (
    <HolographicCard className="max-w-md w-full mx-auto">
      <div className="flex items-center justify-center mb-4">
        <Lock 
          className={`mr-2 ${isFocused ? 'text-neon-blue' : 'text-neon-purple'}`} 
          size={24} 
        />
        <h2 className={`text-xl font-bold ${isFocused ? 'neon-blue-text' : 'neon-text'}`}>
          Secure Access
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={`
          relative flex items-center overflow-hidden rounded-md
          bg-dark-bg border transition-all duration-300
          ${isFocused ? 'border-neon-blue shadow-[0_0_10px_rgba(30,174,219,0.3)]' : 'border-neon-purple'}
        `}>
          <Key 
            size={18} 
            className={`absolute left-3 ${isFocused ? 'text-neon-blue' : 'text-neon-purple'}`} 
          />
          
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full py-2 pl-10 pr-3 bg-transparent text-white focus:outline-none font-mono"
            placeholder={placeholder}
            autoComplete="off"
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <NeonButton 
            type="submit" 
            variant={isFocused ? "blue" : "purple"}
            disabled={!secretKey.trim()}
            className="w-full"
          >
            {buttonText}
          </NeonButton>
        </div>
      </form>
    </HolographicCard>
  );
};

export default SecretKeyInput;
