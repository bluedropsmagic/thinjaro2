import React, { useState } from 'react';
import { ArrowLeft, Clock, Star, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseDetail({ exercise, onBack }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] pb-24">
      {/* Header Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={exercise.image} 
          alt={exercise.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9FC] via-transparent to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 rounded-2xl transition-all duration-300 active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {exercise.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">{exercise.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-[#E8A6C1]" />
              <span className="text-gray-700 font-medium">{exercise.difficulty}</span>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
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
            Workout Steps
          </h2>
          <div className="space-y-3">
            {exercise.steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              return (
                <motion.button
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => toggleStep(index)}
                  className="w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left"
                  style={{
                    background: isCompleted ? `${exercise.color}20` : '#FFF9FC',
                    boxShadow: isCompleted
                      ? `inset 3px 3px 8px ${exercise.color}20, inset -3px -3px 8px rgba(255, 255, 255, 0.8)`
                      : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={24} style={{ color: exercise.color }} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={24} className="text-gray-300 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  )}
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-gray-500 mb-1 block">Step {index + 1}</span>
                    <span className={`font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-700'}`}>
                      {step}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Complete Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleComplete}
          disabled={isCompleted}
          className="w-full py-5 rounded-3xl font-bold text-gray-800 text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
          style={{
            background: isCompleted
              ? 'linear-gradient(135deg, #A6E8C1 0%, #C9A6E8 100%)'
              : `linear-gradient(135deg, ${exercise.color} 0%, #F5D4E4 100%)`,
            boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.8)',
            opacity: isCompleted ? 0.8 : 1,
          }}
        >
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 size={24} />
                Workout Completed! 🎉
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                Mark as Complete
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}