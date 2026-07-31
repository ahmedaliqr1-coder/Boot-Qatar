import React from "react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 w-full">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Payment Gateway Text */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            {/* بوابة الدفع باللون العنابي */}
            <span className="text-[20px] font-bold text-[#8A1538] leading-none whitespace-nowrap">
              بوابة الدفع
            </span>
            {/* Payment Gateway باللون الأسود */}
            <span className="text-[14px] font-medium text-black leading-none whitespace-nowrap mt-1">
              Payment Gateway
            </span>
          </div>
          
          {/* Vertical Divider */}
          <div className="h-10 w-[1.5px] bg-[#8A1538] mx-2"></div>
        </div>

        {/* Right: Large MOI Emblem Only (No text next to it) */}
        <div className="flex items-center">
          <img 
            src="/qatar-moi-logo-final.png" 
            alt="MOI Logo" 
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}
