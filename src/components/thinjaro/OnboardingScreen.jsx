import React, { useState } from 'react';
import { ChevronRight, Sparkles, Dumbbell, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingScreen({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Sparkles,
      title: 'Welcome to ThinJaroApp',
      subtitle: 'Track your progress and transform your routine.',
      gradient: 'from-[#F8DDEB] via-[#F7C5DF] to-[#DCC9F4]',
    },
    {
      icon: Dumbbell,
      title: 'Daily At-Home Exercises',
      subtitle: 'Simple routines designed for metabolism and fat-burn.',
      gradient: 'from-[#F7C5DF] via-[#F8DDEB] to-[#B6E4D2]',
    },
    {
      icon: Activity,
      title: 'Your Personalized Protocol Dashboard',
      subtitle: 'Monitor your wellness journey with beautiful insights.',
      gradient: 'from-[#DCC9F4] via-[#F8DDEB] to-[#F7C5DF]',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentSlideData.gradient} flex flex-col justify-between p-8 transition-all duration-700`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col justify-center items-center text-center"
        >
          {/* Icon Container with Claymorphism */}
          <div
            className="mb-12 rounded-full p-12"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              boxShadow: 'inset 4px 4px 12px rgba(247, 197, 223, 0.3), inset -4px -4px 12px rgba(255, 255, 255, 0.8), 8px 8px 24px rgba(247, 197, 223, 0.2)',
            }}
          >
            <Icon size={80} className="text-[#F7C5DF]" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {currentSlideData.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            {currentSlideData.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Section */}
      <div className="space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentSlide === index ? '32px' : '8px',
                height: '8px',
                background: currentSlide === index ? '#F7C5DF' : 'rgba(247, 197, 223, 0.3)',
                boxShadow: currentSlide === index
                  ? 'inset 2px 2px 4px rgba(247, 197, 223, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full py-5 rounded-3xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #F7C5DF 0%, #F8DDEB 100%)',
            boxShadow: '6px 6px 20px rgba(247, 197, 223, 0.4), -6px -6px 20px rgba(255, 255, 255, 0.8)',
          }}
        >
          {currentSlide < slides.length - 1 ? 'Continue' : 'Start My Journey'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}