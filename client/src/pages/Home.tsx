import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
  const [captchaUrl, setCaptchaUrl] = useState(`https://fees2.moi.gov.qa/moipay/captcha?t=${Date.now()}`);
  
  const isAr = lang === "ar";
  
  const refreshCaptcha = () => {
    setCaptchaUrl(`https://fees2.moi.gov.qa/moipay/captcha?t=${Date.now()}`);
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
                      <option value="QAT">{isAr ? "قطر" : "Qatar"}</option>
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
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] text-center text-sm placeholder:text-gray-300"
                  />
                </div>
                
                <div className="pt-2">
                  <label className={`block text-[14px] font-bold text-[#003E66] mb-3 w-full ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "بيانات المالك" : "Owner Data"}
                  </label>
                  <div className="space-y-3">
                    <div className={`flex items-center ${isAr ? "justify-end" : "justify-start"} gap-2 cursor-pointer`} onClick={() => setOwnerIdType("qid")}>
                      {!isAr && <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ownerIdType === "qid" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "qid" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>}
                      <span className="font-bold text-gray-700 text-[13px]">{isAr ? "رقم شخصي" : "Personal ID"}</span>
                      {isAr && <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ownerIdType === "qid" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "qid" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>}
                    </div>
                    
                    {ownerIdType === "qid" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder={isAr ? "الرجاء إدخال الرقم الشخصي" : "Please enter Personal ID"}
                        className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] text-center text-sm placeholder:text-gray-300"
                      />
                    )}

                    <div className={`flex items-center ${isAr ? "justify-end" : "justify-start"} gap-2 cursor-pointer`} onClick={() => setOwnerIdType("establishment")}>
                      {!isAr && <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ownerIdType === "establishment" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "establishment" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>}
                      <span className="font-bold text-gray-700 text-[13px]">{isAr ? "قيد منشأة" : "Establishment ID"}</span>
                      {isAr && <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ownerIdType === "establishment" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "establishment" && <div className="w-2 h-2 rounded-full bg-[#003E66]"></div>}
                      </div>}
                    </div>

                    {ownerIdType === "establishment" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder={isAr ? "الرجاء إدخال قيد المنشأة" : "Please enter Establishment ID"}
                        className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] text-center text-sm placeholder:text-gray-300"
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
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#003E66] text-center text-base font-bold"
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
    </div>
  );
}
