import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  showLanguageToggle?: boolean;
}

export function Header({ showLanguageToggle = true }: HeaderProps) {
  const { lang, setLanguage } = useLanguage();

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {/* Left: Language Toggle Button */}
          {showLanguageToggle && (
            <button
              onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold bg-white text-[#004A80] hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>
          )}

          {/* Center Divider */}
          <div className="h-8 w-[1px] bg-gray-300 mx-2"></div>

          {/* Right: Ministry Logo & Text */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {/* Ministry Shield Logo - SVG */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Main Shield Shape */}
                <defs>
                  <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#8A1538", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#6D112C", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Crossed Swords */}
                <g fill="none" stroke="#8A1538" strokeWidth="3" strokeLinecap="round">
                  {/* Vertical Sword */}
                  <line x1="50" y1="20" x2="50" y2="75" />
                  {/* Horizontal Sword */}
                  <line x1="25" y1="50" x2="75" y2="50" />
                </g>

                {/* Sword Hilts - Circles */}
                <circle cx="50" cy="50" r="6" fill="#8A1538" />

                {/* Palm Trees - Left */}
                <g fill="#8A1538">
                  <circle cx="35" cy="25" r="2.5" />
                  <line x1="35" y1="27" x2="35" y2="38" stroke="#8A1538" strokeWidth="1.5" />
                </g>

                {/* Palm Trees - Right */}
                <g fill="#8A1538">
                  <circle cx="65" cy="25" r="2.5" />
                  <line x1="65" y1="27" x2="65" y2="38" stroke="#8A1538" strokeWidth="1.5" />
                </g>

                {/* Waves */}
                <path d="M 20 75 Q 30 70 40 75 T 60 75 T 80 75" stroke="#8A1538" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#004A80] leading-tight">
                {lang === "ar" ? "وزارة الداخلية" : "Ministry of Interior"}
              </div>
              <div className="text-[9px] text-gray-500 leading-tight">
                {lang === "ar" ? "دولة قطر" : "State of Qatar"}
              </div>
            </div>
          </div>

          {/* Right: Payment Gateway Text */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-bold text-[#004A80] leading-tight">
              {lang === "ar" ? "بوابة الدفع" : "Payment Gateway"}
            </div>
            <div className="text-[9px] text-gray-500 leading-tight">
              Payment Gateway
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
