import React from 'react';
import { ExternalLink, Heart, Brain, Utensils, Dumbbell, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChannelsScreen() {
  const sections = [
    {
      title: "Women's Weight-Loss Science",
      icon: Brain,
      color: '#E8A6C1',
      channels: [
        { name: 'Dr. Sarah Johnson - Metabolism Expert', description: 'Evidence-based weight loss strategies for women' },
        { name: 'The Female Fat Loss Formula', description: 'Hormonal balance and sustainable fat loss' },
        { name: 'Science of Slim', description: 'Research-backed wellness guidance' },
      ]
    },
    {
      title: 'Hormonal Health Experts',
      icon: Heart,
      color: '#C9A6E8',
      channels: [
        { name: 'Dr. Lisa Mosconi - Brain Health', description: 'Hormones, brain health, and metabolism' },
        { name: 'The Hormone Doctor', description: 'Understanding your body\'s signals' },
        { name: 'Balance Your Hormones Naturally', description: 'Holistic hormonal wellness' },
      ]
    },
    {
      title: 'Healthy Recipes & Meal Prep',
      icon: Utensils,
      color: '#A6E8C1',
      channels: [
        { name: 'Clean Eating Kitchen', description: 'Simple, delicious healthy recipes' },
        { name: 'Meal Prep Mastery', description: 'Easy meal planning for busy women' },
        { name: 'Nourish & Thrive', description: 'Nutrient-dense comfort food' },
      ]
    },
    {
      title: 'Home Workout Creators',
      icon: Dumbbell,
      color: '#F5D4E4',
      channels: [
        { name: 'Fit at Home with Emily', description: 'Beginner-friendly home workouts' },
        { name: 'The Living Room Gym', description: 'No equipment needed routines' },
        { name: 'Move with Grace', description: 'Low-impact exercises for all levels' },
      ]
    },
    {
      title: 'Mind & Mood Wellness',
      icon: Sparkles,
      color: '#E8A6C1',
      channels: [
        { name: 'Mindful Moments Daily', description: 'Meditation and stress relief' },
        { name: 'The Peaceful Mind', description: 'Mental wellness and self-care' },
        { name: 'Emotional Eating Coach', description: 'Breaking free from stress eating' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={sectionIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * sectionIndex }}
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: `${section.color}30`,
                    boxShadow: `inset 2px 2px 6px ${section.color}20, inset -2px -2px 6px rgba(255, 255, 255, 0.8)`,
                  }}
                >
                  <Icon size={24} style={{ color: section.color }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {section.title}
                </h2>
              </div>

              {/* Channels */}
              <div className="space-y-3">
                {section.channels.map((channel, channelIndex) => (
                  <motion.button
                    key={channelIndex}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * channelIndex }}
                    className="w-full p-5 rounded-3xl transition-all duration-300 active:scale-98 text-left"
                    style={{
                      background: 'white',
                      boxShadow: '6px 6px 18px rgba(232, 166, 193, 0.15), -6px -6px 18px rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{channel.name}</h3>
                        <p className="text-sm text-gray-600">{channel.description}</p>
                      </div>
                      <div
                        className="p-3 rounded-2xl flex-shrink-0"
                        style={{
                          background: `${section.color}20`,
                          boxShadow: `inset 2px 2px 4px ${section.color}15, inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
                        }}
                      >
                        <ExternalLink size={18} style={{ color: section.color }} />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}