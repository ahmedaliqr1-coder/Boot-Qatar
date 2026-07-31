import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { lang } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-100 w-full">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Left: Payment Gateway Text */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            {/* بوابة الدفع باللون العنابي */}
            <span className="text-[24px] font-bold text-[#8A1538] leading-none whitespace-nowrap">
              بوابة الدفع
            </span>
            {/* Payment Gateway باللون الأسود */}
            <span className="text-[16px] font-medium text-black leading-none whitespace-nowrap mt-1">
              Payment Gateway
            </span>
          </div>
          
          {/* Vertical Divider */}
          <div className="h-14 w-[1.5px] bg-[#8A1538] mx-2"></div>
          
          {/* Ministry Text */}
          <div className="flex flex-col items-start">
            <span className="text-[24px] font-bold text-[#003E66] leading-none whitespace-nowrap">
              وزارة الداخلية
            </span>
            <span className="text-[16px] font-medium text-[#003E66] leading-none whitespace-nowrap mt-1">
              Ministry of Interior
            </span>
          </div>
        </div>

        {/* Right: Large MOI Emblem */}
        <div className="flex items-center">
          <img 
            src="/qatar-moi-logo-final.png" 
            alt="MOI Logo" 
            className="h-28 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}
