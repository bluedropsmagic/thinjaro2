import React from 'react';

export default function ThinJaroLogo({ className = "", width = 200 }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6918b416ba32a74b780102d8/3e0bb7259_thinjaro.png"
        alt="ThinJaro App"
        style={{ width: `${width}px`, maxWidth: '100%' }}
      />
    </div>
  );
}