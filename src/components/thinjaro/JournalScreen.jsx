import React, { useState } from 'react';
import { Smile, Meh, Frown, Save, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JournalScreen() {
  const [mood, setMood] = useState('happy');
  const [energy, setEnergy] = useState(5);
  const [hunger, setHunger] = useState(5);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const moods = [
    { id: 'happy', icon: Smile, color: '#A6E8C1', label: 'Great' },
    { id: 'neutral', icon: Meh, color: '#C9A6E8', label: 'Okay' },
    { id: 'sad', icon: Frown, color: '#E8A6C1', label: 'Not Great' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {/* Mood Selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background: 'white',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How are you feeling today?</h3>
        <div className="grid grid-cols-3 gap-4">
          {moods.map((moodOption) => {
            const Icon = moodOption.icon;
            const isSelected = mood === moodOption.id;
            return (
              <button
                key={moodOption.id}
                onClick={() => setMood(moodOption.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300"
                style={{
                  background: isSelected ? `${moodOption.color}30` : '#FFF9FC',
                  boxShadow: isSelected
                    ? `inset 3px 3px 8px ${moodOption.color}20, inset -3px -3px 8px rgba(255, 255, 255, 0.8)`
                    : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                }}
              >
                <Icon
                  size={32}
                  style={{ color: isSelected ? moodOption.color : '#9CA3AF' }}
                  strokeWidth={1.5}
                />
                <span className={`text-sm font-semibold ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                  {moodOption.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Energy Level */}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Energy Level</h3>
          <span className="text-2xl font-bold text-[#E8A6C1]">{energy}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={(e) => setEnergy(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E8A6C1 0%, #E8A6C1 ${energy * 10}%, #FFF9FC ${energy * 10}%, #FFF9FC 100%)`,
            boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
          }}
        />
      </motion.div>

      {/* Hunger Level */}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Hunger Level</h3>
          <span className="text-2xl font-bold text-[#C9A6E8]">{hunger}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={hunger}
          onChange={(e) => setHunger(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #C9A6E8 0%, #C9A6E8 ${hunger * 10}%, #FFF9FC ${hunger * 10}%, #FFF9FC 100%)`,
            boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
          }}
        />
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background: 'white',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did today go? Any challenges or wins?"
          rows={6}
          className="w-full p-4 rounded-2xl focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
          style={{
            background: '#FFF9FC',
            boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
          }}
        />
      </motion.div>

      {/* Save Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleSave}
        disabled={saved}
        className="w-full py-5 rounded-3xl font-bold text-gray-800 text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
        style={{
          background: saved
            ? 'linear-gradient(135deg, #A6E8C1 0%, #E8A6C1 100%)'
            : 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
          opacity: saved ? 0.9 : 1,
        }}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check size={24} />
              Saved!
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Save size={24} />
              Save Entry
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}