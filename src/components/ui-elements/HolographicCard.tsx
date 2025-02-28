
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  withScanner?: boolean;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ 
  children, 
  className,
  withScanner = false
}) => {
  return (
    <div className={cn(
      'holographic-card p-6 shadow-lg', 
      withScanner && 'scanner-effect',
      className
    )}>
      {children}
    </div>
  );
};

export default HolographicCard;
