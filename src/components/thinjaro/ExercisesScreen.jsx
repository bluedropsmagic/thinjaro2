import React, { useState, useEffect } from 'react';
import { Clock, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseDetail from './ExerciseDetail';
import { supabase } from '../../lib/supabase';
import { protocolService } from '../../services/protocolService';

export default function ExercisesScreen() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [protocolExercises, setProtocolExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProtocolExercises();
  }, []);

  const loadProtocolExercises = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const protocol = await protocolService.getUserProtocol(user.id);
      if (!protocol) return;

      const objectives = await protocolService.getUserObjectives(user.id);
      const exerciseObjectives = objectives.filter(obj => obj.objective_type === 'exercise');

      const uniqueExercises = [];
      const seen = new Set();

      exerciseObjectives.forEach((obj, index) => {
        if (!seen.has(obj.title)) {
          seen.add(obj.title);
          uniqueExercises.push({
            id: obj.id,
            title: obj.title,
            duration: '15-20 min',
            difficulty: obj.day_number <= 10 ? 'Beginner' : obj.day_number <= 20 ? 'Intermediate' : 'Advanced',
            image: `https://images.unsplash.com/photo-${1518611012118 + index}?w=400&h=300&fit=crop`,
            color: ['#E8A6C1', '#A6E8C1', '#C9A6E8', '#F5D4E4'][index % 4],
            steps: obj.description.split('.').filter(s => s.trim()).map(s => s.trim()),
            dayNumber: obj.day_number,
          });
        }
      });

      setProtocolExercises(uniqueExercises);
    } catch (error) {
      console.error('Error loading protocol exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exercises = [
    {
      id: 1,
      title: 'Morning Metabolism Boost',
      duration: '15 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      color: '#E8A6C1',
      steps: [
        'Start with gentle stretching for 3 minutes',
        '10 squats with proper form',
        '10 lunges on each leg',
        '15 jumping jacks',
        'Repeat the circuit 2 times',
        'Finish with deep breathing for 2 minutes'
      ]
    },
    {
      id: 2,
      title: 'Gentle Beginner Cardio',
      duration: '20 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
      color: '#A6E8C1',
      steps: [
        'Warm up with marching in place for 3 minutes',
        '5 minutes of brisk walking or light jogging',
        'Side steps for 2 minutes',
        'Arm circles while walking for 2 minutes',
        'High knees for 1 minute',
        'Cool down with gentle stretches'
      ]
    },
    {
      id: 3,
      title: '10-Minute Fat Burner',
      duration: '10 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=400&h=300&fit=crop',
      color: '#C9A6E8',
      steps: [
        '2 minutes warm-up with light cardio',
        '20 seconds mountain climbers, 10 seconds rest',
        '20 seconds burpees (modified), 10 seconds rest',
        '20 seconds high knees, 10 seconds rest',
        'Repeat circuit 3 times',
        '1 minute cool-down stretch'
      ]
    },
    {
      id: 4,
      title: 'Low-Impact Routines',
      duration: '25 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      color: '#F5D4E4',
      steps: [
        'Yoga-inspired stretches for 5 minutes',
        'Wall push-ups - 10 reps',
        'Seated leg lifts - 15 reps each side',
        'Chair squats - 12 reps',
        'Gentle core work - 2 minutes',
        'Relaxation and breathing exercises'
      ]
    },
    {
      id: 5,
      title: 'Glute Activation',
      duration: '12 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      color: '#E8A6C1',
      steps: [
        'Glute bridges - 15 reps',
        'Side leg lifts - 12 reps each side',
        'Donkey kicks - 15 reps each side',
        'Fire hydrants - 12 reps each side',
        'Repeat circuit 2 times',
        'Stretch and relax'
      ]
    },
    {
      id: 6,
      title: 'Hormone Balance Flow',
      duration: '18 min',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
      color: '#A6E8C1',
      steps: [
        'Deep breathing exercises - 3 minutes',
        'Cat-cow stretches - 10 reps',
        'Child\'s pose - 2 minutes',
        'Gentle twists - 1 minute each side',
        'Legs up the wall - 5 minutes',
        'Final relaxation - 3 minutes'
      ]
    },
  ];

  if (selectedExercise) {
    return <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }

  const displayExercises = protocolExercises.length > 0 ? protocolExercises : exercises;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9FC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F5D4E4] border-t-[#E8A6C1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-4 pb-24">
      {protocolExercises.length > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-[#E8A6C120] border border-[#E8A6C1]">
          <p className="text-sm text-gray-700 text-center">
            Exercícios do seu protocolo personalizado
          </p>
        </div>
      )}

      {/* Exercise Grid */}
      <div className="grid gap-4">
        {displayExercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * index }}
            onClick={() => setSelectedExercise(exercise)}
            className="w-full rounded-2xl overflow-hidden transition-all duration-300 active:scale-98"
            style={{
              background: 'white',
              boxShadow: '6px 6px 18px rgba(232, 166, 193, 0.2), -6px -6px 18px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img 
                src={exercise.image} 
                alt={exercise.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 text-left">
              <h3 className="text-base font-semibold mb-2 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {exercise.title}
              </h3>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-600" />
                  <span className="text-xs text-gray-700 font-medium">{exercise.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[#E8A6C1]" />
                  <span className="text-xs text-gray-700 font-medium">{exercise.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: `${exercise.color}40`,
                    color: '#4A5568',
                    boxShadow: `inset 2px 2px 4px ${exercise.color}20, inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
                  }}
                >
                  Start Workout
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}