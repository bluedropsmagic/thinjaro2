import React, { useState } from 'react';
import { Bell, Clock, Globe, Info, ChevronRight, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange, itemId }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-14 h-8 rounded-full transition-all duration-300"
    style={{
      background: value ? 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)' : '#E5E7EB',
      boxShadow: value
        ? 'inset 2px 2px 6px rgba(232, 166, 193, 0.4), inset -2px -2px 6px rgba(255, 255, 255, 0.8)'
        : 'inset 2px 2px 6px rgba(0, 0, 0, 0.1), inset -2px -2px 6px rgba(255, 255, 255, 0.8)',
    }}
  >
    <motion.div
      initial={false}
      animate={{ x: value ? 24 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-6 h-6 bg-white rounded-full"
      style={{
        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
      }}
    />
  </button>
);

export default function SettingsScreen({ user, onLogout }) {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
          color: '#E8A6C1',
        },
        {
          icon: Clock,
          label: 'Daily Reminders',
          type: 'toggle',
          value: dailyReminders,
          onChange: setDailyReminders,
          color: '#A6E8C1',
        },
        {
          icon: Globe,
          label: 'Language',
          type: 'select',
          value: 'English',
          color: '#C9A6E8',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          label: 'What is the ThinJaro Protocol?',
          type: 'info',
          color: '#F5D4E4',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Settings
        </h1>
        <p className="text-gray-700 font-medium">Customize your experience 🌸</p>
      </div>

      {/* User Profile Card */}
      {user && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-3xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)',
            boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.5)',
              }}
            >
              <User size={32} className="text-gray-800" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{user.full_name}</h3>
              <p className="text-gray-700 text-sm">{user.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Theme Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-3xl p-6 mb-8"
        style={{
          background: 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)',
          boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">App Theme</h3>
            <p className="text-gray-700 text-sm">Pastel Pink (Default)</p>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.5)',
            }}
          >
            <span className="text-3xl">🎨</span>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (sectionIndex + 1) }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {section.title}
            </h2>
            
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'white',
                boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.8)',
              }}
            >
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const uniqueId = `${sectionIndex}-${itemIndex}`;
                return (
                  <div
                    key={uniqueId}
                    className={`p-5 flex items-center justify-between ${
                      itemIndex < section.items.length - 1 ? 'border-b border-[#FFF9FC]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-2xl"
                        style={{
                          background: `${item.color}30`,
                          boxShadow: `inset 2px 2px 6px ${item.color}20, inset -2px -2px 6px rgba(255, 255, 255, 0.8)`,
                        }}
                      >
                        <Icon size={20} style={{ color: item.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.label}</h3>
                        {item.type === 'select' && (
                          <p className="text-sm text-gray-600 mt-0.5">{item.value}</p>
                        )}
                      </div>
                    </div>

                    {item.type === 'toggle' && (
                      <Toggle value={item.value} onChange={item.onChange} itemId={uniqueId} />
                    )}

                    {(item.type === 'select' || item.type === 'info') && (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl p-6 mt-8"
        style={{
          background: 'linear-gradient(135deg, #A6E8C1 0%, #C9A6E8 100%)',
          boxShadow: '8px 8px 24px rgba(166, 232, 193, 0.3), -8px -8px 24px rgba(255, 255, 255, 0.8)',
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">ThinJaro Protocol</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          A comprehensive wellness approach designed for women, focusing on sustainable weight management, 
          hormone balance, and holistic health through personalized tracking and mindful practices.
        </p>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onLogout}
        className="w-full mt-8 py-5 rounded-3xl font-bold text-gray-800 text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
        style={{
          background: 'white',
          boxShadow: '6px 6px 20px rgba(232, 166, 193, 0.3), -6px -6px 20px rgba(255, 255, 255, 0.8)',
        }}
      >
        <LogOut size={24} />
        Sign Out
      </motion.button>

      {/* Version Info */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">ThinJaroApp v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">Made with 💗 for your wellness journey</p>
      </div>
    </div>
  );
}