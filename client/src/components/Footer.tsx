import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const links = isAr ? [
    ["مواقيت الصلاة", "إمكانية الوصول", "أحوال الطقس"],
    ["شروط الاستخدام", "عن قطر", "تواصل معنا", "بنية المفتاح العام"],
    ["البريد الالكتروني", "ميثاق تجربة المتعامل", "أرقام مهمة"]
  ] : [
    ["Prayer Times", "Accessibility", "Weather"],
    ["Terms of Use", "About Qatar", "Contact Us", "Public Key Infrastructure"],
    ["Email", "Customer Experience Charter", "Important Numbers"]
  ];

  return (
    <footer className="bg-[#2D3E50] text-white py-12 w-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Logos Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <img 
            src="/mada-ar.png" 
            alt="Mada" 
            className="h-16 object-contain brightness-0 invert opacity-90"
          />
          <img 
            src="https://i.ibb.co/3YCP2cj7/webtrust.png" 
            alt="WebTrust" 
            className="h-20 object-contain opacity-90"
          />
        </div>

        {/* Follow Us Text */}
        <p className="text-xl mb-6 font-medium">
          {isAr ? "تابعونا على" : "Follow us on"}
        </p>

        {/* Social Icons - Clean white SVGs like the image */}
        <div className="flex items-center gap-8 mb-10">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.022 18.252c-.151.252-.403.353-.655.202-.201-.101-2.116-1.159-4.368-1.159-2.252 0-4.167 1.058-4.368 1.159-.252.151-.504.05-.655-.202-.151-.252-.05-.504.202-.655.252-.151 2.368-1.31 4.821-1.31 2.453 0 4.569 1.159 4.821 1.31.252.151.353.403.202.655zm.806-3.175c-.202.302-.554.403-.856.202-.252-.151-2.469-1.461-5.14-1.461-2.671 0-4.888 1.31-5.14 1.461-.302.202-.655.101-.856-.202-.202-.302-.101-.655.202-.856.302-.202 2.721-1.613 5.794-1.613 3.073 0 5.492 1.411 5.794 1.613.302.201.403.554.202.856zm.101-3.326c-.252.353-.706.454-1.058.202-.302-.202-2.721-1.814-6.148-1.814-3.427 0-5.846 1.612-6.148 1.814-.353.252-.806.151-1.058-.202-.252-.353-.151-.806.202-1.058.353-.252 3.124-2.116 7.004-2.116 3.88 0 6.651 1.864 7.004 2.116.353.252.454.705.202 1.058z"/>
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.558.217.957.477 1.377.896.419.42.679.819.896 1.377.163.422.358 1.057.412 2.227.059 1.265.07 1.646.07 4.85s-.011 3.585-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.217.558-.477.957-.896 1.377-.42.419-.819.679-1.377.896-.422.163-1.057.358-2.227.412-1.265.059-1.646.07-4.85.07s-3.585-.011-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.558-.217-.957-.477-1.377-.896-.419-.42-.679-.819-.896-1.377-.163-.422-.358-1.057-.412-2.227-.059-1.265-.07-1.646-.07-4.85s.011-3.585.07-4.85c.054-1.17.249-1.805.412-2.227.217-.558.477-.957.896-1.377.42-.419.819-.679 1.377-.896.422-.163 1.057-.358 2.227-.412 1.265-.059 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0z"/>
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>

        {/* Links Grid - Exact lines as the image */}
        <div className="flex flex-col items-center gap-3 mb-8 text-lg">
          {links.map((row, rIdx) => (
            <div key={rIdx} className="flex flex-wrap justify-center items-center gap-x-3">
              {row.map((link, lIdx) => (
                <React.Fragment key={lIdx}>
                  <a href="#" className="hover:underline opacity-90">{link}</a>
                  {lIdx < row.length - 1 && <span className="opacity-60 text-xl">|</span>}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright Text */}
        <p className="text-xl opacity-90 font-medium">
          {isAr 
            ? "جميع الحقوق محفوظة © وزارة الداخلية 2021" 
            : "All Rights Reserved © Ministry of Interior 2021"}
        </p>
      </div>
    </footer>
  );
};
