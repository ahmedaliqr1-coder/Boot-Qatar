import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
  
  const queryMutation = trpc.fines.query.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        if (data.totalFines === 0) {
          toast.info(t("home.noViolations"));
        } else {
          setLocation(`/payment?session=${data.sessionId}`);
        }
      } else {
        toast.error(data.errorMessage || t("home.queryFailed"));
      }
    },
  });

  const handleSearch = () => {
    if (inquiryType === "plate" && !plateNumber) {
      toast.error(t("home.enterPlateNumber"));
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
    <div className="min-h-screen bg-[#E9F1F4]" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header - Built Programmatically */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left: Language Toggle */}
          <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold flex items-center gap-2 bg-white text-[#004A80] hover:bg-gray-50 transition-all"
          >
            {t("home.languageToggle")}
          </button>

          {/* Center: Ministry Logo & Text */}
          <div className="flex flex-col items-center gap-1">
            {/* Ministry Shield Logo - Drawn Programmatically */}
            <div className="w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Sword Cross */}
                <g fill="#8A1538">
                  {/* Vertical Sword */}
                  <rect x="45" y="15" width="10" height="70" rx="2" />
                  {/* Horizontal Sword */}
                  <rect x="25" y="45" width="50" height="10" rx="2" />
                  {/* Sword Hilts */}
                  <circle cx="50" cy="50" r="8" fill="#8A1538" />
                </g>
                {/* Palm Trees */}
                <g fill="#8A1538">
                  <circle cx="35" cy="25" r="3" />
                  <rect x="34" y="28" width="2" height="15" />
                  <circle cx="65" cy="25" r="3" />
                  <rect x="64" y="28" width="2" height="15" />
                </g>
                {/* Waves */}
                <path d="M 20 70 Q 30 65 40 70 T 60 70 T 80 70" stroke="#8A1538" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#004A80]">{t("header.ministry")}</div>
              <div className="text-[10px] text-gray-500">{t("header.stateOfQatar")}</div>
            </div>
          </div>

          {/* Right: Payment Gateway Text */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-bold text-[#004A80]">{t("header.paymentGateway")}</div>
            <div className="text-[10px] text-gray-500">Payment Gateway</div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-8">
           <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold bg-white text-[#004A80]"
           >
             {t("home.languageToggle")}
           </button>
           <h1 className="text-lg font-bold text-[#004A80] text-center flex-1">
             {t("home.title")}
           </h1>
        </div>

        {/* Tabs Grid */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: "establishment", label: t("home.tabs.establishment"), icon: "/icon-establishment.png" },
            { id: "qid", label: t("home.tabs.qid"), icon: "/icon-qid.png" },
            { id: "plate", label: t("home.tabs.plate"), icon: "/icon-plate.png" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setInquiryType(tab.id as any)}
              className={`w-24 h-24 flex flex-col items-center justify-center rounded-2xl border-2 transition-all bg-white ${
                inquiryType === tab.id ? "border-[#004A80]" : "border-transparent"
              }`}
            >
              <img src={tab.icon} alt="" className="w-10 h-10 mb-1" />
              <span className={`text-[10px] font-bold ${inquiryType === tab.id ? "text-[#004A80]" : "text-gray-500"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-[#004A80] text-center mb-6">
             {inquiryType === "plate" && t("home.inquiryTitle.plate")}
             {inquiryType === "qid" && t("home.inquiryTitle.qid")}
             {inquiryType === "establishment" && t("home.inquiryTitle.establishment")}
           </h2>

           <div className="space-y-4">
             {inquiryType === "plate" && (
               <>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">{t("home.labels.country")}</label>
                   <select 
                     value={plateSource}
                     onChange={(e) => setPlateSource(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#004A80]"
                   >
                     <option value="QAT">{lang === "ar" ? "قطر" : "Qatar"}</option>
                     <option value="KSA">{lang === "ar" ? "السعودية" : "Saudi Arabia"}</option>
                     <option value="KWT">{lang === "ar" ? "الكويت" : "Kuwait"}</option>
                     <option value="UAE">{lang === "ar" ? "الإمارات" : "UAE"}</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">{t("home.labels.plateType")}</label>
                   <select 
                     value={plateType}
                     onChange={(e) => setPlateType(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#004A80]"
                   >
                     <option value="1">{lang === "ar" ? "خصوصي" : "Private"}</option>
                     <option value="2">{lang === "ar" ? "نقل خاص" : "Private Transport"}</option>
                     <option value="3">{lang === "ar" ? "دراجة نارية" : "Motorcycle"}</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">{t("home.labels.plateNumber")}</label>
                   <input 
                     type="text" 
                     value={plateNumber}
                     onChange={(e) => setPlateNumber(e.target.value)}
                     placeholder={t("home.placeholders.plateNumber")}
                     className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#004A80]"
                   />
                 </div>
                 
                 <div className="pt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t("home.labels.ownerData")}</label>
                    <div className="flex gap-4 mb-3">
                       <label className="flex items-center gap-2 text-sm">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "qid"} 
                            onChange={() => setOwnerIdType("qid")}
                            className="accent-[#004A80]"
                          />
                          {t("home.labels.qidType")}
                       </label>
                       <label className="flex items-center gap-2 text-sm">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "establishment"} 
                            onChange={() => setOwnerIdType("establishment")}
                            className="accent-[#004A80]"
                          />
                          {t("home.labels.establishmentType")}
                       </label>
                    </div>
                    <input 
                      type="text" 
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      placeholder={ownerIdType === "qid" ? t("home.placeholders.personalId") : t("home.placeholders.establishmentId")}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#004A80]"
                    />
                 </div>
               </>
             )}

             {inquiryType !== "plate" && (
               <div>
                 <label className="block text-sm text-gray-500 mb-1">
                   {inquiryType === "qid" ? t("home.labels.personalId") : t("home.labels.establishmentId")}
                 </label>
                 <input 
                   type="text" 
                   value={ownerId}
                   onChange={(e) => setOwnerId(e.target.value)}
                   className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#004A80]"
                 />
               </div>
             )}

             {/* Captcha Section */}
             <div className="flex items-center gap-2 pt-2">
                <input 
                  type="text" 
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-20 p-3 border border-gray-200 rounded-lg text-center font-bold"
                />
                <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-200 flex justify-between items-center">
                   <img src="https://fees2.moi.gov.qa/moipay/captcha?t=123" alt="captcha" className="h-8" />
                   <button className="text-[#004A80] text-lg">🔄</button>
                </div>
             </div>

             <div className="pt-4 space-y-3">
                <button 
                  onClick={handleSearch}
                  disabled={queryMutation.isPending}
                  className="w-full py-4 bg-[#004A80] text-white rounded-lg font-bold hover:bg-[#003A66] transition-all"
                >
                  {queryMutation.isPending ? "جاري الاستعلام..." : t("home.buttons.search")}
                </button>
                <button 
                  onClick={() => {
                    setPlateNumber("");
                    setOwnerId("");
                    setCaptcha("");
                  }}
                  className="w-full py-3 border border-[#004A80] text-[#004A80] rounded-lg font-bold hover:bg-blue-50 transition-all"
                >
                  {t("home.buttons.clear")}
                </button>
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
           <h3 className="text-3xl font-bold text-[#004A80]">{t("home.footer")}</h3>
           <div className="w-full h-[1px] bg-[#004A80] my-4 opacity-20"></div>
           <p className="text-xs text-gray-400">{t("home.website")}</p>
        </div>
      </main>
    </div>
  );
}
