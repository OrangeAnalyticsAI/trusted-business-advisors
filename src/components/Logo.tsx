
import React from 'react';

export function Logo() {
  return (
    <div className="fixed left-4 top-2 z-50">
      <a href="/" className="block p-2 sm:p-4 glass rounded-xl hover:scale-105 transition-transform">
        <div className="flex flex-col text-left leading-tight">
          <span className="text-base sm:text-2xl">
            <span className="text-[#0EA5E9] font-bold">T</span>rusted
          </span>
          <span className="text-base sm:text-2xl">
            <span className="text-[#0EA5E9] font-bold">B</span>usiness
          </span>
          <span className="text-base sm:text-2xl">
            <span className="text-[#0EA5E9] font-bold">A</span>dvisors
          </span>
        </div>
      </a>
    </div>
  );
}
