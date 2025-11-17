import React, { useState, useRef, useEffect } from 'react';
import { Home, Dumbbell, Play, BookOpen, Activity } from 'lucide-react';
import LoginScreen from '../components/thinjaro/LoginScreen';
import Header from '../components/thinjaro/Header';
import HomeScreen from '../components/thinjaro/HomeScreen';
import ExercisesScreen from '../components/thinjaro/ExercisesScreen';
import ChannelsScreen from '../components/thinjaro/ChannelsScreen';
import ProtocolScreen from '../components/thinjaro/ProtocolScreen';
import JournalScreen from '../components/thinjaro/JournalScreen';
import SettingsScreen from '../components/thinjaro/SettingsScreen';
import { base44 } from '@/api/base44Client';

export default function ThinJaroApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('thinjaroLoggedIn');
    return saved === 'true';
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('thinjaroUser');
    return saved ? JSON.parse(saved) : null;
  });
  const contentRef = useRef(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentScreen('home');
    localStorage.setItem('thinjaroLoggedIn', 'true');
    localStorage.setItem('thinjaroUser', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('thinjaroLoggedIn');
    localStorage.removeItem('thinjaroUser');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    // Scroll to top when changing screen
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigationLeft = [
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'protocol', label: 'Protocol', icon: Activity },
  ];

  const navigationRight = [
    { id: 'channels', label: 'Channels', icon: Play },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} user={user} />;
      case 'exercises':
        return <ExercisesScreen />;
      case 'channels':
        return <ChannelsScreen />;
      case 'protocol':
        return <ProtocolScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'settings':
        return <SettingsScreen user={user} onLogout={handleLogout} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} user={user} />;
    }
  };

  // Not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Logged in - show app
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FC] via-[#F5D4E4] to-[#E8A6C1] fixed inset-0">
      <div className="max-w-md mx-auto h-full bg-[#FFF9FC] relative flex flex-col overflow-hidden">
        {/* Header */}
        <Header onProfileClick={() => handleNavigate('settings')} />

        {/* Main Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto pb-24">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-[#F5D4E4]" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
          <div className="grid grid-cols-5 items-center px-4 pt-2 pb-1 relative">
            {/* Left Navigation */}
            {navigationLeft.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="flex flex-col items-center gap-1 py-2 px-2 transition-all duration-300"
                >
                  <Icon 
                    size={20} 
                    strokeWidth={2}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-[#E8A6C1]' : 'text-gray-400'
                    }`}
                  />
                  <span 
                    className={`text-[9px] font-medium transition-colors duration-300 ${
                      isActive ? 'text-[#E8A6C1]' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Center Home Button */}
            <div className="flex justify-center">
              <button
                onClick={() => handleNavigate('home')}
                className="flex items-center justify-center transition-all duration-300 -mt-6"
                style={{
                  background: currentScreen === 'home' 
                    ? 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)'
                    : 'linear-gradient(135deg, #F5D4E4 0%, #E8A6C1 100%)',
                  boxShadow: '0 8px 24px rgba(232, 166, 193, 0.5), inset 2px 2px 8px rgba(255, 255, 255, 0.3)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                }}
              >
                <Home 
                  size={26} 
                  strokeWidth={2.5}
                  className="text-white"
                />
              </button>
            </div>

            {/* Right Navigation */}
            {navigationRight.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="flex flex-col items-center gap-1 py-2 px-2 transition-all duration-300"
                >
                  <Icon 
                    size={20} 
                    strokeWidth={2}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-[#E8A6C1]' : 'text-gray-400'
                    }`}
                  />
                  <span 
                    className={`text-[9px] font-medium transition-colors duration-300 ${
                      isActive ? 'text-[#E8A6C1]' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}