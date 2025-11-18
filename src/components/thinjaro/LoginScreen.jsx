import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThinJaroLogo from './ThinJaroLogo';
import { supabase } from '../../lib/supabase';

export default function LoginScreen({ onLogin, onSignupComplete }) {
  const [mode, setMode] = useState('initial'); // 'initial', 'login', 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (signupError) throw signupError;

        if (data.user) {
          onSignupComplete(data.user);
        }
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        if (data.user) {
          onLogin(data.user);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFullName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FC] via-[#F5D4E4] to-[#E8A6C1] flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <ThinJaroLogo width={160} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-700 text-sm"
            >
              {mode === 'signup' ? 'Create your account 🌸' : mode === 'login' ? 'Welcome back 🌸' : 'Your wellness journey starts here 🌸'}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'initial' ? (
            <motion.div
              key="initial"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-3"
            >
              <button
                onClick={() => handleModeChange('login')}
                className="w-full py-4 rounded-3xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.8)',
                }}
              >
                <LogIn size={20} />
                Login
              </button>
              
              <button
                onClick={() => handleModeChange('signup')}
                className="w-full py-4 rounded-3xl font-bold text-gray-800 text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                style={{
                  background: 'white',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
                }}
              >
                <UserPlus size={20} />
                Create Account
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onSubmit={handleSubmit}
              className="rounded-3xl p-6 mb-4"
              style={{
                background: 'white',
                boxShadow: '12px 12px 32px rgba(232, 166, 193, 0.25), -12px -12px 32px rgba(255, 255, 255, 0.9)',
              }}
            >
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-800 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <UserPlus size={16} className="text-[#E8A6C1]" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full pl-10 pr-3 py-3 rounded-2xl focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
                      style={{
                        background: '#FFF9FC',
                        boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail size={16} className="text-[#E8A6C1]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-2xl focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
                    style={{
                      background: '#FFF9FC',
                      boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock size={16} className="text-[#E8A6C1]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
                    style={{
                      background: '#FFF9FC',
                      boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-3xl font-bold text-white text-base transition-all duration-300 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.8)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'signup' ? 'Creating...' : 'Signing in...'}
                  </div>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200"
                >
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {mode !== 'initial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button 
              onClick={() => handleModeChange('initial')}
              className="text-gray-700 text-sm hover:text-[#E8A6C1] transition-colors"
            >
              ← Back
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}