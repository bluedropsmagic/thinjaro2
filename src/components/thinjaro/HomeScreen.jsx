import React, { useState, useEffect } from 'react';
import { Droplets, Dumbbell, Apple, Moon, Heart, CheckCircle2, Circle, Sparkles, Play, BookOpen, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';
import { protocolService } from '../../services/protocolService';
import { supabase } from '../../lib/supabase';

export default function HomeScreen({ onNavigate, user, protocolData, onProtocolUpdate }) {
  const protocolDays = protocolData?.protocolDays || [];
  const currentDayNumber = protocolDays.length > 0 ? 1 : 1;
  const todayObjectives = protocolDays.find(d => d.number === currentDayNumber)?.objectives || [];

  const objectiveIcons = {
    hydration: Droplets,
    exercise: Dumbbell,
    nutrition: Apple,
    sleep: Moon,
    mindfulness: Heart,
  };

  const toggleChecklistItem = async (objectiveIndex) => {
    if (todayObjectives.length === 0) return;

    const objective = todayObjectives[objectiveIndex];
    if (!objective || !objective.id) return;

    const newCompletedState = !objective.completed;

    const updatedDays = protocolDays.map(d =>
      d.number === currentDayNumber
        ? {
            ...d,
            objectives: d.objectives.map((obj, idx) =>
              idx === objectiveIndex ? { ...obj, completed: newCompletedState } : obj
            ),
          }
        : d
    );

    onProtocolUpdate?.({
      ...protocolData,
      protocolDays: updatedDays,
    });

    try {
      const { error } = await supabase
        .from('user_objectives')
        .update({ completed: newCompletedState })
        .eq('id', objective.id);

      if (error) {
        console.error('Error updating objective:', error);
        onProtocolUpdate?.({
          ...protocolData,
          protocolDays: protocolDays,
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
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
          Today's Journey
        </h2>
        <div className="space-y-3">
          {todayObjectives.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Loading your daily objectives...</p>
          ) : (
            todayObjectives.map((objective, index) => {
              const Icon = objectiveIcons[objective.type] || Heart;
              return (
                <motion.button
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => toggleChecklistItem(index)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
                    style={{
                      background: objective.completed ? 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)' : '#FFF9FC',
                      boxShadow: objective.completed
                        ? 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.8)'
                        : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {objective.completed ? (
                      <CheckCircle2 size={24} className="text-gray-800" strokeWidth={2} />
                    ) : (
                      <Circle size={24} className="text-gray-300" strokeWidth={2} />
                    )}
                    <Icon size={20} className={objective.completed ? 'text-gray-800' : 'text-[#E8A6C1]'} />
                    <div className="flex-1 text-left">
                      <span className={`font-medium block ${objective.completed ? 'text-gray-800' : 'text-gray-700'}`}>
                        {objective.title}
                      </span>
                      <span className={`text-xs ${objective.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                        {objective.description}
                      </span>
                    </div>
                  </motion.button>
                );
              })
            )}
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