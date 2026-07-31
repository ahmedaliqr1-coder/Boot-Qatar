import React from "react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 w-full sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Left Section: MOI Emblem (Moved to Left) */}
        <div className="flex items-center">
          <img 
            src="/qatar-moi-logo-final.png" 
            alt="MOI Logo" 
            className="h-28 w-auto object-contain"
          />
        </div>

        {/* Right Section: Vertical Line and Payment Gateway (Moved to Right) */}
        <div className="flex items-center gap-6">
          {/* Vertical Divider */}
          <div className="h-14 w-[1.5px] bg-[#8A1538]"></div>
          
          {/* Payment Gateway Text */}
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-[#8A1538] leading-tight whitespace-nowrap">
              بوابة الدفع
            </span>
            <span className="text-[16px] font-medium text-black leading-tight whitespace-nowrap">
              Payment Gateway
            </span>
          </div>
        </div>
      </div>
      
      {/* Sub-header for Language */}
      <div className="bg-white border-y border-gray-200 w-full py-2">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <button className="border border-gray-300 rounded px-3 py-1 flex items-center gap-2 text-sm font-medium text-[#003E66]">
            English <span className="bg-[#003E66] text-white px-1 rounded text-[10px]">A文</span>
          </button>
          <button className="text-[#003E66]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
