import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const COUNTRIES = [
  // Arab Countries First
  { id: "QAT", ar: "قطر", en: "Qatar" },
  { id: "SAU", ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
  { id: "ARE", ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
  { id: "KWT", ar: "الكويت", en: "Kuwait" },
  { id: "BHR", ar: "البحرين", en: "Bahrain" },
  { id: "OMN", ar: "عمان", en: "Oman" },
  { id: "EGY", ar: "مصر", en: "Egypt" },
  { id: "JOR", ar: "الأردن", en: "Jordan" },
  { id: "PSE", ar: "فلسطين", en: "Palestine" },
  { id: "IRQ", ar: "العراق", en: "Iraq" },
  { id: "LBN", ar: "لبنان", en: "Lebanon" },
  { id: "SYR", ar: "سوريا", en: "Syria" },
  { id: "YEM", ar: "اليمن", en: "Yemen" },
  { id: "LBY", ar: "ليبيا", en: "Libya" },
  { id: "SDN", ar: "السودان", en: "Sudan" },
  { id: "MAR", ar: "المغرب", en: "Morocco" },
  { id: "DZA", ar: "الجزائر", en: "Algeria" },
  { id: "TUN", ar: "تونس", en: "Tunisia" },
  { id: "MRT", ar: "موريتانيا", en: "Mauritania" },
  { id: "SOM", ar: "الصومال", en: "Somalia" },
  { id: "DJI", ar: "جيبوتي", en: "Djibouti" },
  { id: "COM", ar: "جزر القمر", en: "Comoros" },
  
  // Rest of the World
  { id: "AFG", ar: "أفغانستان", en: "Afghanistan" },
  { id: "ALB", ar: "ألبانيا", en: "Albania" },
  { id: "AND", ar: "أندورا", en: "Andorra" },
  { id: "AGO", ar: "أنغولا", en: "Angola" },
  { id: "ATG", ar: "أنتيغوا وبربودا", en: "Antigua and Barbuda" },
  { id: "ARG", ar: "الأرجنتين", en: "Argentina" },
  { id: "ARM", ar: "أرمينيا", en: "Armenia" },
  { id: "AUS", ar: "أستراليا", en: "Australia" },
  { id: "AUT", ar: "النمسا", en: "Austria" },
  { id: "AZE", ar: "أذربيجان", en: "Azerbaijan" },
  { id: "BHS", ar: "جزر البهاما", en: "Bahamas" },
  { id: "BGD", ar: "بنغلاديش", en: "Bangladesh" },
  { id: "BRB", ar: "باربادوس", en: "Barbados" },
  { id: "BLR", ar: "بيلاروسيا", en: "Belarus" },
  { id: "BEL", ar: "بلجيكا", en: "Belgium" },
  { id: "BLZ", ar: "بليز", en: "Belize" },
  { id: "BEN", ar: "بنين", en: "Benin" },
  { id: "BTN", ar: "بوتان", en: "Bhutan" },
  { id: "BOL", ar: "بوليفيا", en: "Bolivia" },
  { id: "BIH", ar: "البوسنة والهرسك", en: "Bosnia and Herzegovina" },
  { id: "BWA", ar: "بوتسوانا", en: "Botswana" },
  { id: "BRA", ar: "البرازيل", en: "Brazil" },
  { id: "BRN", ar: "بروناي", en: "Brunei" },
  { id: "BGR", ar: "بلغاريا", en: "Bulgaria" },
  { id: "BFA", ar: "بوركينا فاسو", en: "Burkina Faso" },
  { id: "BDI", ar: "بوروندي", en: "Burundi" },
  { id: "CPV", ar: "الرأس الأخضر", en: "Cabo Verde" },
  { id: "KHM", ar: "كمبوديا", en: "Cambodia" },
  { id: "CMR", ar: "الكاميرون", en: "Cameroon" },
  { id: "CAN", ar: "كندا", en: "Canada" },
  { id: "CAF", ar: "جمهورية أفريقيا الوسطى", en: "Central African Republic" },
  { id: "TCD", ar: "تشاد", en: "Chad" },
  { id: "CHL", ar: "تشيلي", en: "Chile" },
  { id: "CHN", ar: "الصين", en: "China" },
  { id: "COL", ar: "كولومبيا", en: "Colombia" },
  { id: "COG", ar: "الكونغو", en: "Congo" },
  { id: "CRI", ar: "كوستاريكا", en: "Costa Rica" },
  { id: "HRV", ar: "كرواتيا", en: "Croatia" },
  { id: "CUB", ar: "كوبا", en: "Cuba" },
  { id: "CYP", ar: "قبرص", en: "Cyprus" },
  { id: "CZE", ar: "جمهورية التشيك", en: "Czech Republic" },
  { id: "DNK", ar: "الدنمارك", en: "Denmark" },
  { id: "DMA", ar: "دومينيكا", en: "Dominica" },
  { id: "DOM", ar: "جمهورية الدومينيكان", en: "Dominican Republic" },
  { id: "ECU", ar: "الإكوادور", en: "Ecuador" },
  { id: "SLV", ar: "السلفادور", en: "El Salvador" },
  { id: "GNQ", ar: "غينيا الاستوائية", en: "Equatorial Guinea" },
  { id: "ERI", ar: "إريتريا", en: "Eritrea" },
  { id: "EST", ar: "إستونيا", en: "Estonia" },
  { id: "SWZ", ar: "إسواتيني", en: "Eswatini" },
  { id: "ETH", ar: "إثيوبيا", en: "Ethiopia" },
  { id: "FJI", ar: "فيجي", en: "Fiji" },
  { id: "FIN", ar: "فنلندا", en: "Finland" },
  { id: "FRA", ar: "فرنسا", en: "France" },
  { id: "GAB", ar: "الغابون", en: "Gabon" },
  { id: "GMB", ar: "غامبيا", en: "Gambia" },
  { id: "GEO", ar: "جورجيا", en: "Georgia" },
  { id: "DEU", ar: "ألمانيا", en: "Germany" },
  { id: "GHA", ar: "غانا", en: "Ghana" },
  { id: "GRC", ar: "اليونان", en: "Greece" },
  { id: "GRD", ar: "غرينادا", en: "Grenada" },
  { id: "GTM", ar: "غواتيمالا", en: "Guatemala" },
  { id: "GIN", ar: "غينيا", en: "Guinea" },
  { id: "GNB", ar: "غينيا بيساو", en: "Guinea-Bissau" },
  { id: "GUY", ar: "غويانا", en: "Guyana" },
  { id: "HTI", ar: "هايتي", en: "Haiti" },
  { id: "HND", ar: "هندوراس", en: "Honduras" },
  { id: "HUN", ar: "المجر", en: "Hungary" },
  { id: "ISL", ar: "آيسلندا", en: "Iceland" },
  { id: "IND", ar: "الهند", en: "India" },
  { id: "IDN", ar: "إندونيسيا", en: "Indonesia" },
  { id: "IRN", ar: "إيران", en: "Iran" },
  { id: "IRL", ar: "أيرلندا", en: "Ireland" },
  { id: "ITA", ar: "إيطاليا", en: "Italy" },
  { id: "JAM", ar: "جامايكا", en: "Jamaica" },
  { id: "JPN", ar: "اليابان", en: "Japan" },
  { id: "KAZ", ar: "كازاخستان", en: "Kazakhstan" },
  { id: "KEN", ar: "كينيا", en: "Kenya" },
  { id: "KIR", ar: "كيريباتي", en: "Kiribati" },
  { id: "KGZ", ar: "قيرغيزستان", en: "Kyrgyzstan" },
  { id: "LAO", ar: "لاوس", en: "Laos" },
  { id: "LVA", ar: "لاتفيا", en: "Latvia" },
  { id: "LSO", ar: "ليسوتو", en: "Lesotho" },
  { id: "LBR", ar: "ليبيريا", en: "Liberia" },
  { id: "LIE", ar: "ليختنشتاين", en: "Liechtenstein" },
  { id: "LTU", ar: "ليتوانيا", en: "Lithuania" },
  { id: "LUX", ar: "لوكسمبورغ", en: "Luxembourg" },
  { id: "MDG", ar: "مدغشقر", en: "Madagascar" },
  { id: "MWI", ar: "مالاوي", en: "Malawi" },
  { id: "MYS", ar: "ماليزيا", en: "Malaysia" },
  { id: "MDV", ar: "جزر المالديف", en: "Maldives" },
  { id: "MLI", ar: "مالي", en: "Mali" },
  { id: "MLT", ar: "مالطا", en: "Malta" },
  { id: "MHL", ar: "جزر مارشال", en: "Marshall Islands" },
  { id: "MUS", ar: "موريشيوس", en: "Mauritius" },
  { id: "MEX", ar: "المكسيك", en: "Mexico" },
  { id: "FSM", ar: "ميكرونيزيا", en: "Micronesia" },
  { id: "MDA", ar: "مولدوفا", en: "Moldova" },
  { id: "MCO", ar: "موناكو", en: "Monaco" },
  { id: "MNG", ar: "منغوليا", en: "Mongolia" },
  { id: "MNE", ar: "الجبل الأسود", en: "Montenegro" },
  { id: "MOZ", ar: "موزمبيق", en: "Mozambique" },
  { id: "MMR", ar: "ميانمار", en: "Myanmar" },
  { id: "NAM", ar: "ناميبيا", en: "Namibia" },
  { id: "NRU", ar: "ناورو", en: "Nauru" },
  { id: "NPL", ar: "نيبال", en: "Nepal" },
  { id: "NLD", ar: "هولندا", en: "Netherlands" },
  { id: "NZL", ar: "نيوزيلندا", en: "New Zealand" },
  { id: "NIC", ar: "نيكاراغوا", en: "Nicaragua" },
  { id: "NER", ar: "النيجر", en: "Niger" },
  { id: "NGA", ar: "نيجيريا", en: "Nigeria" },
  { id: "PRK", ar: "كورية الشمالية", en: "North Korea" },
  { id: "MKD", ar: "مقدونيا الشمالية", en: "North Macedonia" },
  { id: "NOR", ar: "النرويج", en: "Norway" },
  { id: "PAK", ar: "باكستان", en: "Pakistan" },
  { id: "PLW", ar: "بالاو", en: "Palau" },
  { id: "PAN", ar: "بنما", en: "Panama" },
  { id: "PNG", ar: "بابوا غينيا الجديدة", en: "Papua New Guinea" },
  { id: "PRY", ar: "باراغواي", en: "Paraguay" },
  { id: "PER", ar: "بيرو", en: "Peru" },
  { id: "PHL", ar: "الفلبين", en: "Philippines" },
  { id: "POL", ar: "بولندا", en: "Poland" },
  { id: "PRT", ar: "البرتغال", en: "Portugal" },
  { id: "ROU", ar: "رومانيا", en: "Romania" },
  { id: "RUS", ar: "روسيا", en: "Russia" },
  { id: "RWA", ar: "رواندا", en: "Rwanda" },
  { id: "KNA", ar: "سانت كيتس ونيفيس", en: "Saint Kitts and Nevis" },
  { id: "LCA", ar: "سانت لوسيا", en: "Saint Lucia" },
  { id: "VCG", ar: "سانت فينسنت والغرينادين", en: "Saint Vincent and the Grenadines" },
  { id: "WSM", ar: "ساموا", en: "Samoa" },
  { id: "SMR", ar: "سان مارينو", en: "San Marino" },
  { id: "STP", ar: "ساو تومي وبرينسيب", en: "Sao Tome and Principe" },
  { id: "SEN", ar: "السنغال", en: "Senegal" },
  { id: "SRB", ar: "صربيا", en: "Serbia" },
  { id: "SYC", ar: "سيشل", en: "Seychelles" },
  { id: "SLE", ar: "سيراليون", en: "Sierra Leone" },
  { id: "SGP", ar: "سنغافورة", en: "Singapore" },
  { id: "SVK", ar: "سلوفاكيا", en: "Slovakia" },
  { id: "SVN", ar: "سلوفينيا", en: "Slovenia" },
  { id: "SLB", ar: "جزر سليمان", en: "Solomon Islands" },
  { id: "ZAF", ar: "جنوب أفريقيا", en: "South Africa" },
  { id: "KOR", ar: "كوريا الجنوبية", en: "South Korea" },
  { id: "SSD", ar: "جنوب السودان", en: "South Sudan" },
  { id: "ESP", ar: "إسبانيا", en: "Spain" },
  { id: "LKA", ar: "سريلانكا", en: "Sri Lanka" },
  { id: "SUR", ar: "سورينام", en: "Suriname" },
  { id: "SWE", ar: "السويد", en: "Sweden" },
  { id: "CHE", ar: "سويسرا", en: "Switzerland" },
  { id: "TWN", ar: "تايوان", en: "Taiwan" },
  { id: "TJK", ar: "طاجيكستان", en: "Tajikistan" },
  { id: "TZA", ar: "تنزانيا", en: "Tanzania" },
  { id: "THA", ar: "تايلاند", en: "Thailand" },
  { id: "TLS", ar: "تيمور الشرقية", en: "Timor-Leste" },
  { id: "TGO", ar: "توغو", en: "Togo" },
  { id: "TON", ar: "تونغا", en: "Tonga" },
  { id: "TTO", ar: "ترينيداد وتوباغو", en: "Trinidad and Tobago" },
  { id: "TUR", ar: "تركيا", en: "Turkey" },
  { id: "TKM", ar: "تركمانستان", en: "Turkmenistan" },
  { id: "TUV", ar: "توفالو", en: "Tuvalu" },
  { id: "UGA", ar: "أوغندا", en: "Uganda" },
  { id: "UKR", ar: "أوكرانيا", en: "Ukraine" },
  { id: "GBR", ar: "المملكة المتحدة", en: "United Kingdom" },
  { id: "USA", ar: "الولايات المتحدة الأمريكية", en: "United States" },
  { id: "URY", ar: "أوروغواي", en: "Uruguay" },
  { id: "UZB", ar: "أوزبكستان", en: "Uzbekistan" },
  { id: "VUT", ar: "فانواتو", en: "Vanuatu" },
  { id: "VAT", ar: "الفاتيكان", en: "Vatican City" },
  { id: "VEN", ar: "فنزويلا", en: "Venezuela" },
  { id: "VNM", ar: "فيتنام", en: "Vietnam" },
  { id: "ZMB", ar: "زامبيا", en: "Zambia" },
  { id: "ZWE", ar: "زيمبابوي", en: "Zimbabwe" }
];

const PLATE_TYPES = [
  { id: "1", ar: "خصوصي", en: "Private" },
  { id: "2", ar: "خصوصي (Q)", en: "Private (Q)" },
  { id: "3", ar: "خصوصي (T)", en: "Private (T)" },
  { id: "4", ar: "خصوصي (R)", en: "Private (R)" },
  { id: "5", ar: "حكومة", en: "Government" },
  { id: "6", ar: "تجارية", en: "Commercial" },
  { id: "7", ar: "نقل خاص", en: "Private Transport" },
  { id: "8", ar: "آليات", en: "Machinery" },
  { id: "9", ar: "مقطورة", en: "Trailer" },
  { id: "10", ar: "نقل عام", en: "Public Transport" },
  { id: "11", ar: "هيئة دبلوماسية", en: "Diplomatic Corps" },
  { id: "12", ar: "شرطة", en: "Police" },
  { id: "13", ar: "دراجة نارية شرطة", en: "Police Motorcycle" },
  { id: "14", ar: "دراجة نارية خصوصية", en: "Private Motorcycle" },
  { id: "15", ar: "أجرة", en: "Taxi" },
  { id: "16", ar: "سيارة لخويا", en: "Lekhwiya Car" },
  { id: "17", ar: "دراجة لخويا", en: "Lekhwiya Motorcycle" },
  { id: "18", ar: "سيارة الحرس الأميري", en: "Amiri Guard Car" },
  { id: "19", ar: "دراجة الحرس الأميري", en: "Amiri Guard Motorcycle" },
  { id: "20", ar: "ليموزين", en: "Limousine" },
  { id: "21", ar: "القوات المسلحة القطرية", en: "Qatar Armed Forces" },
  { id: "22", ar: "إدخال مؤقت", en: "Temporary Entry" },
  { id: "23", ar: "معدة", en: "Equipment" },
  { id: "24", ar: "هيئة الامم المتحدة", en: "United Nations" },
  { id: "25", ar: "تصْدير", en: "Export" },
  { id: "26", ar: "آليات حكومية", en: "Government Machinery" },
  { id: "27", ar: "تحت التجربة", en: "Under Test" },
  { id: "28", ar: "مقطورة حكومية", en: "Government Trailer" }
];

export default function Home() {
  const { lang, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [inquiryType, setInquiryType] = useState<"plate" | "qid" | "establishment">("plate");
  const [plateSource, setPlateSource] = useState("QAT");
  const [plateType, setPlateType] = useState("1");
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerIdType, setOwnerIdType] = useState<"qid" | "establishment">("qid");
  const [ownerId, setOwnerId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState(`/api/captcha?t=${Date.now()}`);
  
  const isAr = lang === "ar";
  
  const refreshCaptcha = () => {
    setCaptchaUrl(`/api/captcha?t=${Date.now()}`);
  };

  const queryMutation = trpc.fines.query.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        if (data.totalFines === 0) {
          toast.info(isAr ? "لا توجد مخالفات مسجلة" : "No violations recorded");
        } else {
          setLocation(`/payment?session=${data.sessionId}`);
        }
      } else {
        toast.error(data.errorMessage || (isAr ? "فشل الاستعلام" : "Query failed"));
        refreshCaptcha();
      }
    },
  });

  const handleSearch = () => {
    if (inquiryType === "plate" && !plateNumber) {
      toast.error(isAr ? "الرجاء إدخال رقم اللوحة" : "Please enter plate number");
      return;
    }
    if (!captcha) {
      toast.error(isAr ? "الرجاء إدخال رمز التحقق" : "Please enter captcha code");
      return;
    }
    queryMutation.mutate({
      inquiryType,
      plateSource: inquiryType === "plate" ? plateSource : undefined,
      plateNumber: inquiryType === "plate" ? plateNumber : undefined,
      plateType: inquiryType === "plate" ? plateType : undefined,
      ownerIdType: inquiryType === "plate" ? ownerIdType : (inquiryType === "qid" ? "qid" : "establishment"),
      ownerId: ownerId,
      lang: lang as "ar" | "en",
    });
  };

  return (
    <div className="min-h-screen bg-[#E9F1F4]" dir={isAr ? "rtl" : "ltr"}>
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-[18px] font-bold text-[#003E66]">
            {isAr ? "الاستعلام عن المخالفات المرورية" : "Traffic Violations Inquiry"}
          </h1>
        </div>

        {/* Inquiry Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { id: "plate", icon: "/icon-plate.png" },
            { id: "qid", icon: "/icon-qid.png" },
            { id: "establishment", icon: "/icon-establishment.png" }
          ].reverse().map((tab) => {
            const isActive = inquiryType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInquiryType(tab.id as any)}
                className={`flex flex-col items-center justify-center transition-all h-20 w-full bg-white rounded-xl border-2 ${
                  isActive ? "border-[#003E66] shadow-sm" : "border-transparent"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center p-2">
                  <img 
                    src={tab.icon} 
                    alt={tab.id} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Inquiry Form Card */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h2 className="text-[16px] font-bold text-[#003E66] text-center mb-6">
            {inquiryType === "plate" && (isAr ? "استعلام برقم المركبة" : "Inquiry by Plate Number")}
            {inquiryType === "qid" && (isAr ? "استعلام بالرقم الشخصي" : "Inquiry by Personal ID")}
            {inquiryType === "establishment" && (isAr ? "استعلام بقيد المنشأة" : "Inquiry by Establishment ID")}
          </h2>

          <div className="space-y-4">
            {inquiryType === "plate" && (
              <>
                <div className="flex flex-col">
                  <label className={`text-[13px] font-bold text-gray-700 mb-1.5 w-full ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "البلد" : "Country"}
                  </label>
                  <div className="relative w-full">
                    <select 
                      value={plateSource}
                      onChange={(e) => setPlateSource(e.target.value)}
                      className={`w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right pr-4 pl-10" : "text-left pl-4 pr-10"} appearance-none font-medium text-sm`}
                    >
                      {COUNTRIES.map(country => (
                        <option key={country.id} value={country.id}>{isAr ? country.ar : country.en}</option>
                      ))}
                    </select>
                    <div className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={`text-[13px] font-bold text-gray-700 mb-1.5 w-full ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "نوع اللوحة" : "Plate Type"}
                  </label>
                  <div className="relative w-full">
                    <select 
                      value={plateType}
                      onChange={(e) => setPlateType(e.target.value)}
                      className={`w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right pr-4 pl-10" : "text-left pl-4 pr-10"} appearance-none font-medium text-sm`}
                    >
                      {PLATE_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{isAr ? type.ar : type.en}</option>
                      ))}
                    </select>
                    <div className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={`text-[13px] font-bold text-gray-700 mb-1.5 w-full ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "رقم اللوحة" : "Plate Number"}
                  </label>
                  <input 
                    type="text" 
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={isAr ? "الرجاء إدخال رقم المركبة" : "Please enter plate number"}
                    className={`w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right" : "text-left"} text-sm placeholder:text-gray-300`}
                  />
                </div>
                
                <div className="pt-2">
                  <label className={`block text-[14px] font-bold text-[#003E66] mb-3 w-full ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "بيانات المالك" : "Owner Data"}
                  </label>
                  <div className={`w-full flex flex-col space-y-3 ${isAr ? "items-start" : "items-start"}`}>
                    <div className="flex items-center gap-2 cursor-pointer w-full" onClick={() => setOwnerIdType("qid")}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${ownerIdType === "qid" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "qid" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>
                      <span className="font-bold text-gray-700 text-[13px]">{isAr ? "رقم شخصي" : "Personal ID"}</span>
                    </div>
                    
                    {ownerIdType === "qid" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder={isAr ? "الرجاء إدخال الرقم الشخصي" : "Please enter Personal ID"}
                        className={`w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right" : "text-left"} text-sm placeholder:text-gray-300`}
                      />
                    )}

                    <div className="flex items-center gap-2 cursor-pointer w-full" onClick={() => setOwnerIdType("establishment")}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${ownerIdType === "establishment" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "establishment" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>
                      <span className="font-bold text-gray-700 text-[13px]">{isAr ? "قيد منشأة" : "Establishment ID"}</span>
                    </div>

                    {ownerIdType === "establishment" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder={isAr ? "الرجاء إدخال قيد المنشأة" : "Please enter Establishment ID"}
                        className={`w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right" : "text-left"} text-sm placeholder:text-gray-300`}
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div className="flex flex-col">
                <label className={`text-[13px] font-bold text-gray-700 mb-1.5 w-full ${isAr ? "text-right" : "text-left"}`}>
                  {inquiryType === "qid" ? (isAr ? "الرقم الشخصي" : "Personal ID") : (isAr ? "قيد المنشأة" : "Establishment ID")}
                </label>
                <input 
                  type="text" 
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className={`w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] ${isAr ? "text-right" : "text-left"} text-base font-bold`}
                />
              </div>
            )}

            {/* Captcha Section */}
            <div className="flex items-center gap-2 pt-4">
              <input 
                type="text" 
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-20 p-2.5 border border-gray-200 rounded-lg text-center font-bold text-lg"
              />
              <div className="flex-1 bg-[#F8FAFC] p-1.5 rounded-lg border border-gray-200 flex justify-between items-center px-3 h-12 overflow-hidden">
                <img 
                  src={captchaUrl} 
                  alt="captcha" 
                  className="h-full object-contain mix-blend-multiply"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x50?text=Captcha';
                  }}
                />
                <div className="flex gap-2">
                  <button onClick={refreshCaptcha} className="text-[#003E66] text-xl hover:scale-110 transition-transform">🔄</button>
                  <button className="text-[#003E66] text-xl hover:scale-110 transition-transform">🔊</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <button 
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="w-full py-3 bg-[#003E66] text-white rounded-lg font-bold text-[16px] hover:bg-[#002A44] transition-all shadow-sm active:scale-[0.98]"
              >
                {queryMutation.isPending ? (isAr ? "جاري الاستعلام..." : "Searching...") : (isAr ? "استعلم" : "Search")}
              </button>
              <button 
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                  refreshCaptcha();
                }}
                className="w-full py-3 border-2 border-[#003E66] text-[#003E66] rounded-lg font-bold text-[16px] hover:bg-blue-50 transition-all active:scale-[0.98]"
              >
                {isAr ? "مسح" : "Clear"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
