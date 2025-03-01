
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import HolographicCard from '@/components/ui-elements/HolographicCard';
import GlitchText from '@/components/ui-elements/GlitchText';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast({
        title: "Success!",
        description: "Check your email for the confirmation link",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during Google login",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <HolographicCard className="w-full max-w-md">
        <div className="text-center mb-6">
          <GlitchText text="SecretChat" className="text-3xl font-bold text-neon-blue" />
          <p className="text-neon-purple mt-2">Secure. Encrypted. Anonymous.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-2 rounded-md bg-dark-bg border border-neon-purple focus:border-neon-blue outline-none text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 rounded-md bg-dark-bg border border-neon-purple focus:border-neon-blue outline-none text-white"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-1/2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
            <Button 
              type="button" 
              onClick={handleSignUp} 
              disabled={loading} 
              variant="secondary"
              className="w-1/2 font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-purple opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-dark-bg text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            variant="outline" 
            className="w-full mt-4 bg-black text-white border border-gray-600 hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Google
          </Button>
        </div>
      </HolographicCard>
    </div>
  );
};

export default Auth;
