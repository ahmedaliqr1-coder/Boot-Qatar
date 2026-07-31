import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { lang, setLanguage } = useLanguage();
  const isAr = lang === "ar";

  return (
    <header className="bg-white border-b border-gray-100 w-full sticky top-0 z-50 shadow-sm">
      {/* Main Header Row - Reduced Padding for Slimmer Look */}
      <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-between" dir={isAr ? "rtl" : "ltr"}>
        {/* MOI Emblem - Large size but within a slim container */}
        <div className="flex items-center py-1">
          <img 
            src="/qatar-moi-logo-new.png" 
            alt="MOI Logo" 
            className="h-20 w-auto object-contain transform scale-110 origin-center"
          />
        </div>

        {/* Vertical Line and Payment Gateway - Slimmer Layout */}
        <div className="flex items-center gap-3">
          {/* Vertical Divider */}
          <div className="h-8 w-[1.5px] bg-[#8A1538]"></div>
          
          {/* Payment Gateway Text */}
          <div className={`flex flex-col ${isAr ? "items-end" : "items-start"}`}>
            <span className="text-[17px] font-bold text-[#8A1538] leading-none whitespace-nowrap mb-0.5">
              {isAr ? "بوابة الدفع" : "Payment Gateway"}
            </span>
            <span className="text-[12px] font-medium text-black leading-none whitespace-nowrap">
              {isAr ? "Payment Gateway" : "بوابة الدفع"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Sub-header for Language - Slimmer Padding */}
      <div className="bg-white border-y border-gray-100 w-full py-1">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center" dir={isAr ? "rtl" : "ltr"}>
          <button 
            onClick={() => setLanguage(isAr ? "en" : "ar")}
            className="border border-gray-200 rounded px-2 py-0.5 flex items-center gap-1.5 text-xs font-medium text-[#003E66] hover:bg-gray-50 transition-colors"
          >
            {isAr ? "English" : "العربية"} 
            <span className="bg-[#003E66] text-white px-1 rounded text-[9px]">A文</span>
          </button>
          <button className="text-[#003E66]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
