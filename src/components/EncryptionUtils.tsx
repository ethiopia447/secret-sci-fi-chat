
// This is a simple encryption/decryption utility for demonstration
// In a real application, you'd want to use a more secure encryption algorithm

export const encryptMessage = (message: string, secretKey: string): string => {
  // Simple XOR encryption for demonstration purposes
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  // Convert to Base64 to ensure it's displayable
  return btoa(encrypted);
};

export const decryptMessage = (encryptedMessage: string, secretKey: string): string => {
  try {
    // Decode from Base64
    const decoded = atob(encryptedMessage);
    
    // XOR decryption
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "Decryption failed. Invalid message or key.";
  }
};

// Simulate decryption progress (for visual effect)
export const simulateDecryption = (
  callback: (progress: number, currentText: string) => void,
  finalText: string,
  duration: number = 2000
) => {
  const steps = 10;
  const stepDuration = duration / steps;
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i <= steps; i++) {
    setTimeout(() => {
      const progress = i / steps;
      
      // Generate a random string that gradually becomes the final text
      let currentText = '';
      for (let j = 0; j < finalText.length; j++) {
        if (Math.random() < progress) {
          currentText += finalText[j];
        } else {
          currentText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      callback(progress, currentText);
    }, i * stepDuration);
  }
};
