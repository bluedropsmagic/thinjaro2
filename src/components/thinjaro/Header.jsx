import React from 'react';
import { User } from 'lucide-react';

export default function Header({ onProfileClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onProfileClick();
  };

  return (
    <div 
      className="sticky top-0 z-50 backdrop-blur-lg border-b border-[#E8A6C1] px-4 py-2"
      style={{
        background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
      }}
    >
      <div className="flex items-center justify-between">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6918b416ba32a74b780102d8/6291dfb68_thinjarobranco.png"
          alt="ThinJaro App"
          className="h-6"
        />
        <button
          onClick={handleClick}
          onTouchEnd={handleClick}
          className="p-3 rounded-2xl transition-all duration-300 active:scale-95 relative cursor-pointer touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1), inset 1px 1px 4px rgba(255, 255, 255, 0.5)',
            zIndex: 9999,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <User size={20} className="text-white pointer-events-none" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}