import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Zap, Target } from 'lucide-react';
import ThinJaroLogo from './ThinJaroLogo';

const loadingMessages = [
  { text: 'Analyzing your responses', icon: Sparkles },
  { text: 'Creating your personalized protocol', icon: Heart },
  { text: 'Adjusting daily objectives', icon: Target },
  { text: 'Almost ready', icon: Zap },
];

export default function ProtocolLoadingScreen() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = loadingMessages[currentMessageIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FFF9FC] via-[#F5D4E4] to-[#E8A6C1] z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ThinJaroLogo width={120} />
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            className="relative w-24 h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-[#F5D4E4]"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E8A6C1]"
              style={{
                boxShadow: '0 0 20px rgba(232, 166, 193, 0.3)'
              }}
            ></div>
          </motion.div>

          {/* Messages */}
          <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon size={32} className="text-[#E8A6C1]" />
                </motion.div>

                <p className="text-lg font-semibold text-gray-800 text-center">
                  {currentMessage.text}...
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor: index === currentMessageIndex
                    ? '#E8A6C1'
                    : '#F5D4E4',
                  scale: index === currentMessageIndex ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
