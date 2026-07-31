import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const footerLinks = isAr
    ? [
        { title: "عن الوزارة", links: ["كلمة الوزير", "عن قطر", "عن الوزارة"] },
        { title: "الخدمات", links: ["خدمات الأفراد", "خدمات الشركات", "خدمات الزوار"] },
        { title: "المركز الإعلامي", links: ["الأخبار", "الفعاليات", "الوسائط"] },
        { title: "روابط هامة", links: ["بوابة حكومي", "الجريدة الرسمية", "سياسة الخصوصية"] },
      ]
    : [
        { title: "About MOI", links: ["Minister's Message", "About Qatar", "About MOI"] },
        { title: "Services", links: ["Personal Services", "Business Services", "Visitor Services"] },
        { title: "Media Center", links: ["News", "Events", "Media"] },
        { title: "Important Links", links: ["Hukoomi", "Official Gazette", "Privacy Policy"] },
      ];

  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200 mt-12 pt-12 pb-8 w-full">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-[#003E66] mb-4 text-[15px]">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="text-gray-500 hover:text-[#003E66] text-[13px] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media and Copyright */}
        <div className={`flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 gap-6 ${isAr ? "md:flex-row-reverse" : ""}`}>
          {/* Trust and Social Icons */}
          <div className="flex items-center gap-6">
            {/* Trust Icons */}
            <div className="flex items-center gap-3 border-r border-gray-300 pr-6 mr-2">
              <img src="https://i.ibb.co/3YCP2cj7/webtrust.png" alt="WebTrust" className="h-10 object-contain" />
              <img src="https://i.ibb.co/nMsvT5HQ/mada-ar.png" alt="Mada" className="h-10 object-contain" />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-[#003E66] flex items-center justify-center text-white hover:bg-[#002A44] transition-all">
                <span className="text-xs">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#003E66] flex items-center justify-center text-white hover:bg-[#002A44] transition-all">
                <span className="text-xs">f</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#003E66] flex items-center justify-center text-white hover:bg-[#002A44] transition-all">
                <span className="text-xs">in</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#003E66] flex items-center justify-center text-white hover:bg-[#002A44] transition-all">
                <span className="text-xs">📸</span>
              </a>
            </div>
          </div>

          {/* Copyright Text */}
          <div className={`text-gray-500 text-[13px] ${isAr ? "text-right" : "text-left"}`}>
            {isAr 
              ? "جميع الحقوق محفوظة لوزارة الداخلية - دولة قطر © 2026" 
              : "All Rights Reserved to Ministry of Interior - State of Qatar © 2026"}
          </div>
        </div>
      </div>
    </footer>
  );
};
