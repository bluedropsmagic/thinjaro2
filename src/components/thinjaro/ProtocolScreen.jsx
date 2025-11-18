import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, X, CheckCircle2, Circle, Droplets, Dumbbell, Apple, Moon, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionnaireModal from './QuestionnaireModal';
import { supabase } from '../../lib/supabase';
import { protocolService } from '../../services/protocolService';

const DayDetail = ({ day, onClose, onToggleObjective }) => {
  const objectiveIcons = {
    hydration: Droplets,
    exercise: Dumbbell,
    nutrition: Apple,
    sleep: Moon,
    mindfulness: Heart,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-auto rounded-t-3xl p-6 pb-8"
        style={{
          background: 'white',
          boxShadow: '0 -8px 32px rgba(232, 166, 193, 0.3)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Day {day.number}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{day.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl transition-all"
            style={{
              background: '#FFF9FC',
              boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.15)',
            }}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-3">
          {day.objectives.map((objective, index) => {
            const Icon = objectiveIcons[objective.type];
            const isCompleted = objective.completed;
            return (
              <button
                key={index}
                onClick={() => onToggleObjective(day.number, index)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left"
                style={{
                  background: isCompleted ? '#E8A6C120' : '#FFF9FC',
                  boxShadow: isCompleted
                    ? 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)'
                    : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={24} className="text-[#E8A6C1] flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Circle size={24} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                )}
                <Icon size={20} className={isCompleted ? 'text-[#E8A6C1]' : 'text-gray-400'} />
                <div className="flex-1">
                  <h3 className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-700'}`}>
                    {objective.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">{objective.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProtocolScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const [hasCustomProtocol, setHasCustomProtocol] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [protocolData, setProtocolData] = useState(null);
  const [protocolDays, setProtocolDays] = useState(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (30 - i));
      
      days.push({
        number: i,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        objectives: [
          {
            type: 'hydration',
            title: 'Morning Hydration',
            description: '2 glasses of water upon waking',
            completed: i < 25 ? Math.random() > 0.3 : false,
          },
          {
            type: 'exercise',
            title: 'Daily Exercise',
            description: '15-20 minutes home workout',
            completed: i < 25 ? Math.random() > 0.4 : false,
          },
          {
            type: 'nutrition',
            title: 'Healthy Meals',
            description: '3 balanced meals, avoid processed foods',
            completed: i < 25 ? Math.random() > 0.3 : false,
          },
          {
            type: 'sleep',
            title: 'Quality Sleep',
            description: '7-8 hours of restful sleep',
            completed: i < 25 ? Math.random() > 0.5 : false,
          },
          {
            type: 'mindfulness',
            title: 'Mindfulness Practice',
            description: '5 minutes of meditation or breathing',
            completed: i < 25 ? Math.random() > 0.4 : false,
          },
        ],
      });
    }
    
    return days;
  });

  useEffect(() => {
    loadUserProtocol();
  }, []);

  const loadUserProtocol = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      setUser(currentUser);

      const protocol = await protocolService.getUserProtocol(currentUser.id);
      if (protocol) {
        setProtocolData(protocol);
        setHasCustomProtocol(true);
        await loadProtocolDays(currentUser.id);
      }
    } catch (error) {
      console.error('Error loading protocol:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProtocolDays = async (userId) => {
    try {
      const objectives = await protocolService.getUserObjectives(userId);

      const dayGroups = objectives.reduce((acc, obj) => {
        if (!acc[obj.day_number]) {
          acc[obj.day_number] = [];
        }
        acc[obj.day_number].push(obj);
        return acc;
      }, {});

      const today = new Date();
      const days = Object.keys(dayGroups).map(dayNum => {
        const dayNumber = parseInt(dayNum);
        const date = new Date(today);
        date.setDate(today.getDate() - (30 - dayNumber));

        return {
          number: dayNumber,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          objectives: dayGroups[dayNum].map(obj => ({
            id: obj.id,
            type: obj.objective_type,
            title: obj.title,
            description: obj.description,
            completed: obj.completed,
          })),
        };
      });

      days.sort((a, b) => a.number - b.number);
      setProtocolDays(days);
    } catch (error) {
      console.error('Error loading protocol days:', error);
    }
  };

  const toggleObjective = async (dayNumber, objectiveIndex) => {
    const day = protocolDays.find(d => d.number === dayNumber);
    if (!day) return;

    const objective = day.objectives[objectiveIndex];
    const newCompletedState = !objective.completed;

    setProtocolDays(prevDays =>
      prevDays.map(d =>
        d.number === dayNumber
          ? {
              ...d,
              objectives: d.objectives.map((obj, idx) =>
                idx === objectiveIndex ? { ...obj, completed: newCompletedState } : obj
              ),
            }
          : d
      )
    );

    try {
      if (objective.id) {
        await protocolService.updateObjectiveCompletion(objective.id, newCompletedState);
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      setProtocolDays(prevDays =>
        prevDays.map(d =>
          d.number === dayNumber
            ? {
                ...d,
                objectives: d.objectives.map((obj, idx) =>
                  idx === objectiveIndex ? { ...obj, completed: !newCompletedState } : obj
                ),
              }
            : d
        )
      );
    }
  };

  const handleGenerateProtocol = async (answers) => {
    if (!user) {
      alert('Você precisa estar logado para gerar um protocolo.');
      return;
    }

    const regenerationCheck = await protocolService.canRegenerateProtocol(user.id);
    if (!regenerationCheck.canRegenerate) {
      alert(`Você só pode regenerar seu protocolo após 30 dias.\nDias restantes: ${regenerationCheck.daysRemaining}`);
      setShowQuestionnaire(false);
      return;
    }

    setIsGeneratingProtocol(true);
    setShowQuestionnaire(false);

    try {
      await protocolService.generateProtocol(user.id, answers);
      await loadUserProtocol();
    } catch (error) {
      console.error('Error generating protocol:', error);
      alert(`Erro ao gerar protocolo: ${error.message}\n\nPor favor, tente novamente.`);
      setShowQuestionnaire(true);
    } finally {
      setIsGeneratingProtocol(false);
    }
  };

  const objectiveIcons = {
    hydration: Droplets,
    exercise: Dumbbell,
    nutrition: Apple,
    sleep: Moon,
    mindfulness: Heart,
  };

  // Calculate completion percentage
  const totalObjectives = protocolDays.reduce((sum, day) => sum + day.objectives.length, 0);
  const completedObjectives = protocolDays.reduce(
    (sum, day) => sum + day.objectives.filter(obj => obj.completed).length,
    0
  );
  const completionPercentage = Math.round((completedObjectives / totalObjectives) * 100);

  // Calculate streak
  let streak = 0;
  for (let i = protocolDays.length - 1; i >= 0; i--) {
    const dayCompletion = protocolDays[i].objectives.filter(obj => obj.completed).length;
    if (dayCompletion >= 4) {
      streak++;
    } else {
      break;
    }
  }

  // Get today's objectives (last day)
  const todayObjectives = protocolDays[protocolDays.length - 1]?.objectives || [];

  // Weekly data for bar chart (last 7 days)
  const weeklyData = protocolDays.slice(-7).map(day => {
    const completedCount = day.objectives.filter(obj => obj.completed).length;
    const totalCount = day.objectives.length;
    const value = Math.round((completedCount / totalCount) * 100);
    const dayName = new Date(day.date + ', 2025').toLocaleDateString('en-US', { weekday: 'short' });
    return {
      day: dayName,
      value,
      height: `${Math.max(value, 10)}%`,
    };
  });

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {/* Generate Custom Protocol Button */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setShowQuestionnaire(true)}
        className="w-full rounded-3xl p-4 mb-6 flex items-center justify-between"
        style={{
          background: hasCustomProtocol
            ? 'linear-gradient(135deg, #C9A6E8 0%, #E8A6C1 100%)'
            : 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              boxShadow: 'inset 2px 2px 6px rgba(232, 166, 193, 0.3), inset -2px -2px 6px rgba(255, 255, 255, 0.5)',
            }}
          >
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {hasCustomProtocol ? 'Gerar Novo Protocolo' : 'Gerar Protocolo Personalizado'}
            </h3>
            <p className="text-sm text-white/90">
              {hasCustomProtocol ? 'Criar outro protocolo com IA' : 'Criado especialmente para você com IA'}
            </p>
          </div>
        </div>
        <div className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.button>

      {/* Overall Progress */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl p-4 mb-6"
        style={{
          background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{completionPercentage}%</h2>
              <p className="text-white/90 text-sm font-medium">Overall Completion</p>
            </div>
            <div className="h-10 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-white" />
              <span className="text-white font-medium">{streak} Day Streak</span>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.5)',
            }}
          >
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Today's Journey */}
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
          {todayObjectives.map((objective, index) => {
            const Icon = objectiveIcons[objective.type];
            const isCompleted = objective.completed;
            return (
              <button
                key={index}
                onClick={() => toggleObjective(30, index)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left"
                style={{
                  background: isCompleted ? '#E8A6C120' : '#FFF9FC',
                  boxShadow: isCompleted
                    ? 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)'
                    : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={24} className="text-[#E8A6C1] flex-shrink-0" strokeWidth={2} />
                ) : (
                  <Circle size={24} className="text-gray-300 flex-shrink-0" strokeWidth={2} />
                )}
                <Icon size={20} className={isCompleted ? 'text-[#E8A6C1]' : 'text-gray-400'} />
                <div className="flex-1">
                  <h3 className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-700'}`}>
                    {objective.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">{objective.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Weekly Progress */}
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
          Weekly Progress
        </h2>
        {/* Bar Chart */}
        <div className="flex items-end justify-between h-48 gap-2">
          {weeklyData.map((day, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: day.height }}
              transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
              className="flex-1 flex flex-col items-center gap-3"
            >
              <div
                className="w-full rounded-2xl relative"
                style={{
                  height: day.height,
                  background: 'linear-gradient(180deg, #E8A6C1 0%, #C9A6E8 100%)',
                  boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.3), -2px -2px 8px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600">
                  {day.value}%
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">{day.day}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 30-Day Calendar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl p-6"
        style={{
          background: 'white',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          30-Day Calendar
        </h2>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {protocolDays.map((day, index) => {
            const completedCount = day.objectives.filter(obj => obj.completed).length;
            const totalCount = day.objectives.length;
            const dayCompletionPercentage = (completedCount / totalCount) * 100;
            const isFullyCompleted = completedCount === totalCount;
            const isPartiallyCompleted = completedCount > 0 && completedCount < totalCount;

            return (
              <motion.button
                key={day.number}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.01 * index }}
                onClick={() => setSelectedDay(day)}
                className="aspect-square rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 active:scale-95"
                style={{
                  background: isFullyCompleted
                    ? 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)'
                    : isPartiallyCompleted
                    ? '#F5D4E4'
                    : '#FFF9FC',
                  boxShadow: isFullyCompleted || isPartiallyCompleted
                    ? 'inset 2px 2px 6px rgba(232, 166, 193, 0.3), inset -2px -2px 6px rgba(255, 255, 255, 0.8)'
                    : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                <span
                  className={`text-sm font-bold ${
                    isFullyCompleted ? 'text-white' : isPartiallyCompleted ? 'text-gray-800' : 'text-gray-600'
                  }`}
                >
                  {day.number}
                </span>
                <span className="text-[8px] text-gray-600 mt-0.5">
                  {completedCount}/{totalCount}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                boxShadow: 'inset 2px 2px 6px rgba(232, 166, 193, 0.3)',
              }}
            />
            <span className="text-gray-600">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: '#F5D4E4',
                boxShadow: 'inset 2px 2px 6px rgba(232, 166, 193, 0.3)',
              }}
            />
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg"
              style={{
                background: '#FFF9FC',
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.15)',
              }}
            />
            <span className="text-gray-600">Not Started</span>
          </div>
        </div>
      </motion.div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetail
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onToggleObjective={toggleObjective}
          />
        )}
      </AnimatePresence>

      {/* Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        onSubmit={handleGenerateProtocol}
      />
    </div>
  );
}