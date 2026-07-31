import React from "react";

export function Header() {
  return (
    <header className="bg-[#F8FAFC] w-full">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Payment Gateway Text */}
        <div className="flex flex-col items-start">
          <span className="text-[20px] font-bold text-black leading-tight">بوابة الدفع</span>
          <span className="text-[16px] font-medium text-black leading-tight">Payment Gateway</span>
        </div>

        {/* Center: MOI Emblem (Larger and Centered) */}
        <div className="flex-1 flex justify-center px-4">
          <img 
            src="/qatar-moi-logo-final.png" 
            alt="MOI Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Right: Ministry of Interior Text with Vertical Line */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-[1.5px] bg-[#8A1538]"></div>
          <div className="flex flex-col items-end">
            <span className="text-[20px] font-bold text-black leading-tight">وزارة الداخلية</span>
            <span className="text-[16px] font-medium text-black leading-tight">Ministry of Interior</span>
            <span className="text-[12px] font-medium text-gray-500 leading-tight">State of Qatar • دولة قطر</span>
          </div>
        </div>
      </div>
      
      {/* Sub-header for Language (As seen in the image) */}
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
