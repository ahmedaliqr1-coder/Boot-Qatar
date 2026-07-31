import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { lang, setLanguage } = useLanguage();
  const isAr = lang === "ar";

  return (
    <header className="bg-white border-b border-gray-100 w-full sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between" dir={isAr ? "rtl" : "ltr"}>
        {/* MOI Emblem (Increased to be very prominent) */}
        <div className="flex items-center">
          <img 
            src="/qatar-moi-logo-final.png" 
            alt="MOI Logo" 
            className="h-28 w-auto object-contain"
          />
        </div>

        {/* Vertical Line and Payment Gateway */}
        <div className="flex items-center gap-4">
          {/* Vertical Divider */}
          <div className="h-12 w-[2px] bg-[#8A1538]"></div>
          
          {/* Payment Gateway Text */}
          <div className={`flex flex-col ${isAr ? "items-end" : "items-start"}`}>
            <span className="text-[20px] font-bold text-[#8A1538] leading-tight whitespace-nowrap">
              {isAr ? "بوابة الدفع" : "Payment Gateway"}
            </span>
            <span className="text-[14px] font-medium text-black leading-tight whitespace-nowrap">
              {isAr ? "Payment Gateway" : "بوابة الدفع"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Sub-header for Language */}
      <div className="bg-white border-y border-gray-100 w-full py-1.5">
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
