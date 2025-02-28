
import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  active?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className, 
  active = true 
}) => {
  if (!active) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <span 
      className={cn('glitch-text', className)} 
      data-text={text}
    >
      {text}
    </span>
  );
};

export default GlitchText;
