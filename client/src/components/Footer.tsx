import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
  >
    {children}
  </a>
);

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
    <footer className="bg-[#001F3F] text-white mt-12 pt-16 pb-8 w-full border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-white mb-6 text-[16px] relative inline-block">
                {section.title}
                <span className={`absolute -bottom-2 ${isAr ? "right-0" : "left-0"} w-8 h-0.5 bg-[#8C1D3D]`}></span>
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="text-gray-300 hover:text-white text-[14px] transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media and Copyright */}
        <div className={`flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/10 gap-8 ${isAr ? "md:flex-row-reverse" : ""}`}>
          {/* Logo and Social Icons */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4">
              <img src="/qatar-moi-logo.png" alt="MOI Qatar" className="h-14 brightness-0 invert" />
            </div>

            <div className="flex items-center gap-3">
              <SocialIcon href="https://twitter.com/Moi_Qatar">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com/moigovqatar">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com/moi_qatar">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.558.217.957.477 1.377.896.419.42.679.819.896 1.377.163.422.358 1.057.412 2.227.059 1.265.07 1.646.07 4.85s-.011 3.585-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.217.558-.477.957-.896 1.377-.42.419-.819.679-1.377.896-.422.163-1.057.358-2.227.412-1.265.059-1.646.07-4.85.07s-3.585-.011-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.558-.217-.957-.477-1.377-.896-.419-.42-.679-.819-.896-1.377-.163-.422-.358-1.057-.412-2.227-.059-1.265-.07-1.646-.07-4.85s.011-3.585.07-4.85c.054-1.17.249-1.805.412-2.227.217-.558.477-.957.896-1.377.42-.419.819-.679 1.377-.896.422-.163 1.057-.358 2.227-.412 1.265-.059 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com/company/moigovqatar">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://youtube.com/user/moigovqatar">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Copyright Text */}
          <div className={`text-gray-400 text-[14px] ${isAr ? "text-right" : "text-left"}`}>
            {isAr 
              ? "جميع الحقوق محفوظة لوزارة الداخلية - دولة قطر © 2026" 
              : "All Rights Reserved to Ministry of Interior - State of Qatar © 2026"}
          </div>
        </div>
      </div>
    </footer>
  );
};
