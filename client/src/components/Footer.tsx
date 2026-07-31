import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const rows = isAr ? [
    ["مواقيت الصلاة", "إمكانية الوصول", "أحوال الطقس"],
    ["شروط الاستخدام", "عن قطر", "تواصل معنا", "بنية المفتاح العام"],
    ["البريد الالكتروني", "ميثاق تجربة المتعامل", "أرقام مهمة"]
  ] : [
    ["Prayer Times", "Accessibility", "Weather"],
    ["Terms of Use", "About Qatar", "Contact Us", "Public Key Infrastructure"],
    ["Email", "Customer Experience Charter", "Important Numbers"]
  ];

  return (
    <footer className="bg-[#314252] text-white pt-12 pb-10 w-full" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }} dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Logos Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <img 
            src="https://i.ibb.co/nMsvT5HQ/mada-ar.png" 
            alt="Mada" 
            className="h-16 w-auto object-contain"
          />
          <img 
            src="https://i.ibb.co/3YCP2cj7/webtrust.png" 
            alt="WebTrust" 
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Follow Us Text */}
        <div className="text-xl mb-6 font-medium text-white/90">
          {isAr ? "تابعونا على" : "Follow us on"}
        </div>

        {/* Social Icons - Precise SVGs matching the image style */}
        <div className="flex items-center gap-7 mb-10">
          {/* Snapchat */}
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.75c-3.17 0-5.75 2.58-5.75 5.75 0 .54.08 1.06.22 1.55-.91.35-1.57 1.22-1.57 2.25 0 .42.11.82.3 1.17-.55.45-.9 1.13-.9 1.9 0 1.01.61 1.88 1.48 2.25-.03.13-.05.27-.05.41 0 1.38 1.12 2.5 2.5 2.5.14 0 .28-.02.41-.05.37.87 1.24 1.48 2.25 1.48.77 0 1.45-.35 1.9-.9.35.19.75.3 1.17.3 1.03 0 1.9-.66 2.25-1.57.49.14 1.01.22 1.55.22 3.17 0 5.75-2.58 5.75-5.75 0-3.17-2.58-5.75-5.75-5.75z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8 stroke-white stroke-[2] fill-none" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="white"/>
            </svg>
          </a>
          {/* YouTube - The exact box style with text */}
          <a href="#" className="hover:opacity-70 transition-opacity">
            <div className="border-[1.5px] border-white rounded-md px-1.5 py-0.5 flex flex-col items-center justify-center leading-none min-w-[42px]">
              <span className="text-[10px] font-bold tracking-tighter">You</span>
              <span className="text-[10px] font-bold tracking-tighter">Tube</span>
            </div>
          </a>
          {/* X */}
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>

        {/* Links Rows - Matching the image font, size and layout */}
        <div className="flex flex-col items-center gap-3 mb-10 text-[18px] font-medium">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex flex-wrap justify-center items-center gap-x-3">
              {row.map((link, lIdx) => (
                <React.Fragment key={lIdx}>
                  <a href="#" className="hover:underline whitespace-nowrap text-white/90">{link}</a>
                  {lIdx < row.length - 1 && <span className="text-white/40 text-xl font-light">|</span>}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright Line */}
        <div className="text-[19px] font-medium text-white/90">
          {isAr 
            ? "جميع الحقوق محفوظة © وزارة الداخلية 2021" 
            : "All Rights Reserved © Ministry of Interior 2021"}
        </div>
      </div>
    </footer>
  );
};
