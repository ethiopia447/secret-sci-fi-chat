
import React, { useState, useEffect } from 'react';
import { decryptMessage, simulateDecryption } from './EncryptionUtils';
import HolographicCard from './ui-elements/HolographicCard';
import GlitchText from './ui-elements/GlitchText';

interface MessageDisplayProps {
  encryptedMessage: string;
  secretKey: string;
  sender: string;
  timestamp: string;
  isDecrypting: boolean;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  encryptedMessage,
  secretKey,
  sender,
  timestamp,
  isDecrypting
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [decryptionProgress, setDecryptionProgress] = useState<number>(0);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [isDecryptionInProgress, setIsDecryptionInProgress] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when a new message is received
    if (encryptedMessage) {
      setDisplayText('');
      setDecryptionProgress(0);
      setIsDecrypted(false);
    }
  }, [encryptedMessage]);

  useEffect(() => {
    if (isDecrypting && encryptedMessage && !isDecryptionInProgress && !isDecrypted) {
      setIsDecryptionInProgress(true);
      
      // Decrypt the message
      const decryptedText = decryptMessage(encryptedMessage, secretKey);
      
      // Simulate the visual decryption process - increased from 3000 to 6000 ms
      simulateDecryption(
        (progress, currentText) => {
          setDecryptionProgress(progress);
          setDisplayText(currentText);
          
          if (progress === 1) {
            setIsDecrypted(true);
            setIsDecryptionInProgress(false);
          }
        },
        decryptedText,
        6000 // Increased duration from 3000ms to 6000ms
      );
    }
  }, [isDecrypting, encryptedMessage, secretKey, isDecryptionInProgress, isDecrypted]);

  // Display encrypted text if not decrypting
  const messageText = isDecrypting 
    ? displayText 
    : encryptedMessage.substring(0, 40) + (encryptedMessage.length > 40 ? '...' : '');

  return (
    <HolographicCard 
      className={`mb-4 transition-all duration-300 ${
        isDecrypting ? 'border border-neon-blue shadow-[0_0_15px_rgba(30,174,219,0.3)]' : ''
      }`}
      withScanner={isDecryptionInProgress}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-neon-purple">{sender}</span>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>
      
      <div className="py-2 px-4 bg-dark-bg bg-opacity-50 rounded-md min-h-[60px] flex items-center">
        {isDecryptionInProgress ? (
          <div className="w-full">
            <div className="mb-2 text-neon-blue animate-pulse">
              Decrypting: {Math.round(decryptionProgress * 100)}%
            </div>
            <GlitchText 
              text={messageText}
              active={decryptionProgress < 0.9}
              className={decryptionProgress >= 0.9 ? "text-neon-pink" : ""}
            />
          </div>
        ) : (
          <div className={`w-full ${isDecrypted ? "text-white" : "text-gray-500 font-mono"}`}>
            {isDecrypted ? messageText : (
              <>
                <span className="text-neon-pink">[ENCRYPTED]</span> {messageText}
              </>
            )}
          </div>
        )}
      </div>
      
      {!isDecrypting && !isDecrypted && (
        <div className="mt-2 text-xs text-gray-400">
          Enter the secret key to decrypt this message
        </div>
      )}
    </HolographicCard>
  );
};

export default MessageDisplay;
