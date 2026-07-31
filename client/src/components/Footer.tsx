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
    <footer className="bg-[#2D3E50] text-white py-16 w-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Logos Section - Exact as Image */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <img 
            src="https://i.ibb.co/nMsvT5HQ/mada-ar.png" 
            alt="Mada" 
            className="h-24 w-auto object-contain"
          />
          <img 
            src="https://i.ibb.co/3YCP2cj7/webtrust.png" 
            alt="WebTrust" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Follow Us Text - Bold and Large */}
        <div className="text-2xl mb-8 font-bold tracking-wide">
          {isAr ? "تابعونا على" : "Follow us on"}
        </div>

        {/* Social Icons - Correct Icons matching the image style */}
        <div className="flex items-center gap-8 mb-12">
          {/* Snapchat Ghost */}
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.75c-3.17 0-5.75 2.58-5.75 5.75 0 .54.08 1.06.22 1.55-.91.35-1.57 1.22-1.57 2.25 0 .42.11.82.3 1.17-.55.45-.9 1.13-.9 1.9 0 1.01.61 1.88 1.48 2.25-.03.13-.05.27-.05.41 0 1.38 1.12 2.5 2.5 2.5.14 0 .28-.02.41-.05.37.87 1.24 1.48 2.25 1.48.77 0 1.45-.35 1.9-.9.35.19.75.3 1.17.3 1.03 0 1.9-.66 2.25-1.57.49.14 1.01.22 1.55.22 3.17 0 5.75-2.58 5.75-5.75 0-3.17-2.58-5.75-5.75-5.75zm-1.25 9.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm2.5 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
            </svg>
          </a>
          {/* Instagram Camera */}
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-10 h-10 stroke-white stroke-[1.5] fill-none" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          {/* YouTube with "You Tube" text style as in image */}
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-14 h-14 fill-white" viewBox="0 0 24 24">
              <path d="M10 15l5.19-3L10 9v6z"/>
              <path d="M21.56 7.14c-.21-.79-.83-1.41-1.62-1.62C18.54 5 12 5 12 5s-6.54 0-7.94.52c-.79.21-1.41.83-1.62 1.62C2 8.54 2 12 2 12s0 3.46.44 4.86c.21.79.83 1.41 1.62 1.62C5.46 19 12 19 12 19s6.54 0 7.94-.52c.79-.21 1.41-.83 1.62-1.62.44-1.4.44-4.86.44-4.86s0-3.46-.44-4.86z"/>
              <text x="4" y="22" fontSize="4" fontWeight="bold" fill="white">You</text>
              <text x="14" y="22" fontSize="4" fontWeight="bold" fill="white">Tube</text>
            </svg>
          </a>
          {/* X Logo */}
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* Facebook 'f' */}
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>

        {/* Links Rows - Matching the image font and spacing */}
        <div className="flex flex-col items-center gap-5 mb-12 text-[21px] font-medium">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex flex-wrap justify-center items-center gap-x-4 leading-relaxed">
              {row.map((link, lIdx) => (
                <React.Fragment key={lIdx}>
                  <a href="#" className="hover:underline whitespace-nowrap opacity-95">{link}</a>
                  {lIdx < row.length - 1 && <span className="opacity-40 text-2xl font-light">|</span>}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright Line - Matching exact year and text */}
        <div className="text-[21px] font-bold opacity-90 mt-2">
          {isAr 
            ? "جميع الحقوق محفوظة © وزارة الداخلية 2021" 
            : "All Rights Reserved © Ministry of Interior 2021"}
        </div>
      </div>
    </footer>
  );
};
