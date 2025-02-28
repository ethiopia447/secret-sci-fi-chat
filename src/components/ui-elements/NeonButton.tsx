
import React from 'react';
import { cn } from "@/lib/utils";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'blue' | 'pink';
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  className, 
  variant = 'purple',
  ...props 
}) => {
  const baseClasses = "relative px-6 py-3 rounded-md font-mono text-white transition-all duration-300 hover:scale-105 focus:outline-none";
  
  const variantClasses = {
    purple: "bg-dark-card border border-neon-purple hover:bg-opacity-80 shadow-[0_0_15px_rgba(155,135,245,0.5)]",
    blue: "bg-dark-card border border-neon-blue hover:bg-opacity-80 shadow-[0_0_15px_rgba(30,174,219,0.5)]",
    pink: "bg-dark-card border border-neon-pink hover:bg-opacity-80 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;
