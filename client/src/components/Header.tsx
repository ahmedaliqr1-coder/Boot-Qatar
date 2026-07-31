import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { lang } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 w-full">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Payment Gateway Text (Matching Image) */}
        <div className="flex flex-col items-start">
          <div className="text-[#004A80] font-bold text-sm leading-tight">
            {lang === "ar" ? "بوابة الدفع" : "Payment Gateway"}
          </div>
          <div className="text-gray-500 text-[10px] font-medium leading-tight">
            Payment Gateway
          </div>
        </div>

        {/* Center: Divider */}
        <div className="h-10 w-[1.5px] bg-[#8A1538] mx-2"></div>

        {/* Right: MOI Logo & Text (Matching Image) */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex flex-col items-end">
            <div className="text-[#004A80] font-bold text-sm leading-tight text-right">
              {lang === "ar" ? "وزارة الداخلية" : "Ministry of Interior"}
            </div>
            <div className="text-gray-500 text-[10px] font-medium leading-tight text-right">
              {lang === "ar" ? "دولة قطر" : "State of Qatar"} • State of Qatar
            </div>
          </div>
          {/* Official MOI Emblem */}
          <img 
            src="/qatar-moi-logo-new.png" 
            alt="MOI Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}
