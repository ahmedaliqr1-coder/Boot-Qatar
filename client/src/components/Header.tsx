import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { lang } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-100 w-full">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Payment Gateway Text */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[20px] font-bold text-[#003E66] leading-tight">
              {lang === "ar" ? "بوابة الدفع" : "Payment Gateway"}
            </span>
            <span className="text-[14px] font-medium text-[#003E66] leading-tight">
              Payment Gateway
            </span>
          </div>
          
          {/* Vertical Divider */}
          <div className="h-12 w-[1.5px] bg-[#8A1538] mx-2"></div>
          
          {/* MOI Text */}
          <div className="flex flex-col items-start">
            <span className="text-[20px] font-bold text-[#003E66] leading-tight">
              {lang === "ar" ? "وزارة الداخلية" : "Ministry of Interior"}
            </span>
            <span className="text-[14px] font-medium text-[#003E66] leading-tight">
              {lang === "ar" ? "دولة قطر" : "Ministry of Interior"}
            </span>
            <span className="text-[12px] font-medium text-[#003E66] leading-tight">
              State of Qatar • دولة قطر
            </span>
          </div>
        </div>

        {/* Right: MOI Emblem */}
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
