import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SocialIcon = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    title={label}
    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
  >
    {icon}
  </a>
);

export const Footer = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const footerLinks = isAr
    ? [
        { label: "مواقيت الصلاة", href: "#" },
        { label: "إمكانية الوصول", href: "#" },
        { label: "شروط الاستخدام", href: "#" },
        { label: "عن قطر", href: "#" },
        { label: "تواصل معنا", href: "#" },
        { label: "بنية المفاهيم العام", href: "#" },
        { label: "البريد الإلكتروني", href: "#" },
        { label: "ميثاق تجربة المتعامل", href: "#" },
        { label: "أرقام مهمة", href: "#" },
        { label: "أحوال الطقس", href: "#" },
      ]
    : [
        { label: "Prayer Times", href: "#" },
        { label: "Accessibility", href: "#" },
        { label: "Terms of Use", href: "#" },
        { label: "About Qatar", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "General Framework", href: "#" },
        { label: "Email", href: "#" },
        { label: "User Experience Charter", href: "#" },
        { label: "Important Numbers", href: "#" },
        { label: "Weather", href: "#" },
      ];

  return (
    <footer className="bg-[#3d4f5f] text-white py-16 w-full" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top Section - Logos and Trust Badges */}
        <div className="flex flex-col items-center justify-center mb-12 gap-8">
          {/* Mada Logo */}
          <div className="flex items-center justify-center">
            <img 
              src="/mada-ar.png" 
              alt="Mada" 
              className="h-16 object-contain brightness-0 invert"
            />
          </div>

          {/* WebTrust Logo */}
          <div className="flex items-center justify-center">
            <img 
              src="https://i.ibb.co/3YCP2cj7/webtrust.png" 
              alt="WebTrust" 
              className="h-20 object-contain"
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col items-center justify-center mb-12 gap-6">
          <p className="text-lg font-semibold text-center">
            {isAr ? "تابعونا على" : "Follow Us On"}
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <SocialIcon 
              href="https://snapchat.com/moiqatar" 
              icon="👻" 
              label="Snapchat"
            />
            <SocialIcon 
              href="https://instagram.com/moi_qatar" 
              icon="📷" 
              label="Instagram"
            />
            <SocialIcon 
              href="https://youtube.com/user/moigovqatar" 
              icon="▶️" 
              label="YouTube"
            />
            <SocialIcon 
              href="https://twitter.com/MOI_QatarEn" 
              icon="𝕏" 
              label="X (Twitter)"
            />
            <SocialIcon 
              href="https://facebook.com/moigovqatar.en" 
              icon="f" 
              label="Facebook"
            />
          </div>
        </div>

        {/* Footer Links - Centered with Dividers */}
        <div className="flex flex-wrap items-center justify-center gap-0 mb-8 text-sm text-gray-200">
          {footerLinks.map((link, index) => (
            <React.Fragment key={index}>
              <a 
                href={link.href}
                className="px-3 py-2 hover:text-white transition-colors duration-200 text-center"
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="text-gray-400">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Copyright Text */}
        <div className="text-center text-sm text-gray-300 border-t border-white/10 pt-6">
          {isAr 
            ? "جميع الحقوق محفوظة © وزارة الداخلية 2026" 
            : "All Rights Reserved © Ministry of Interior 2026"}
        </div>
      </div>
    </footer>
  );
};
