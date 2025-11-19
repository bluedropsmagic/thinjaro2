import React, { useState } from 'react';
import { Droplets, Footprints, Dumbbell, Moon, Heart, CheckCircle2, Circle, Sparkles, Play, BookOpen, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';

export default function HomeScreen({ onNavigate, user }) {
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Morning hydration', icon: Droplets, completed: true },
    { id: 2, label: '8,000 steps', icon: Footprints, completed: true },
    { id: 3, label: 'Morning exercises', icon: Dumbbell, completed: false },
    { id: 4, label: 'Evening routine', icon: Moon, completed: false },
    { id: 5, label: 'Mindfulness practice', icon: Heart, completed: true },
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const progressData = [
    { label: 'Appetite Control', value: 75, color: '#E8A6C1' },
    { label: 'Metabolism', value: 85, color: '#A6E8C1' },
    { label: 'Energy', value: 65, color: '#C9A6E8' },
  ];

  const quickActions = [
    { label: 'Exercises', icon: Dumbbell, screen: 'exercises', color: '#E8A6C1' },
    { label: 'Protocol', icon: Activity, screen: 'protocol', color: '#A6E8C1' },
    { label: 'Channels', icon: Play, screen: 'channels', color: '#C9A6E8' },
    { label: 'Journal', icon: BookOpen, screen: 'journal', color: '#F5D4E4' },
  ];

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2 className="text-lg text-gray-600 mb-1">Hello,</h2>
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {firstName}! 👋
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)',
            boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.8), 6px 6px 16px rgba(232, 166, 193, 0.2)',
          }}
        >
          <Sparkles size={20} className="text-gray-800" />
          <span className="text-gray-800 font-semibold">You're doing great. Keep it up! 🌸</span>
        </motion.div>
      </div>

      {/* Daily Checklist Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background: 'white',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Today's Checklist
        </h2>
        <div className="space-y-3">
          {checklist.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => toggleChecklistItem(item.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
                style={{
                  background: item.completed ? 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)' : '#FFF9FC',
                  boxShadow: item.completed
                    ? 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.8)'
                    : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                {item.completed ? (
                  <CheckCircle2 size={24} className="text-gray-800" strokeWidth={2} />
                ) : (
                  <Circle size={24} className="text-gray-300" strokeWidth={2} />
                )}
                <Icon size={20} className={item.completed ? 'text-gray-800' : 'text-[#E8A6C1]'} />
                <span className={`font-medium ${item.completed ? 'text-gray-800' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Progress Rings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background: 'white',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Today's Progress
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {progressData.map((data, index) => (
            <ProgressRing key={index} {...data} />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(action.screen)}
                className="p-6 rounded-3xl transition-all duration-300 active:scale-95"
                style={{
                  background: 'white',
                  boxShadow: '6px 6px 18px rgba(232, 166, 193, 0.2), -6px -6px 18px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                  style={{
                    background: `${action.color}20`,
                    boxShadow: `inset 2px 2px 6px ${action.color}40, inset -2px -2px 6px rgba(255, 255, 255, 0.8)`,
                  }}
                >
                  <Icon size={28} style={{ color: action.color }} strokeWidth={1.5} />
                </div>
                <span className="block text-gray-800 font-semibold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}