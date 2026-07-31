import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
import { CarIcon, PersonIcon, BuildingIcon } from "@/components/Icons";
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
      {/* Header Component (Original Design) */}
      <Header />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Language Toggle Row (Below Header as requested) */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="border border-gray-300 rounded px-3 py-1 text-sm font-bold bg-white text-[#004A80] flex items-center gap-1"
          >
            {lang === "ar" ? "English" : "العربية"} <span className="text-xs">🌐</span>
          </button>
        </div>

        {/* Title Row */}
        <div className="text-center mb-8">
           <h1 className="text-xl font-bold text-[#004A80]">
             {t("home.title")}
           </h1>
        </div>

        {/* Tabs Grid (Matching Original Icons) */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: "establishment", label: t("home.tabs.establishment"), icon: BuildingIcon },
            { id: "qid", label: t("home.tabs.qid"), icon: PersonIcon },
            { id: "plate", label: t("home.tabs.plate"), icon: CarIcon }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setInquiryType(tab.id as any)}
                className={`w-24 h-24 flex flex-col items-center justify-center rounded-2xl border-2 transition-all bg-white ${
                  inquiryType === tab.id ? "border-[#004A80]" : "border-transparent shadow-sm"
                }`}
              >
                <div className={inquiryType === tab.id ? "scale-110 transition-transform" : ""}>
                  <IconComponent />
                </div>
                <span className={`text-[11px] font-bold mt-2 ${inquiryType === tab.id ? "text-[#004A80]" : "text-gray-500"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Card (Pixel Perfect Form) */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-[#004A80] text-center mb-8">
             {inquiryType === "plate" && t("home.inquiryTitle.plate")}
             {inquiryType === "qid" && t("home.inquiryTitle.qid")}
             {inquiryType === "establishment" && t("home.inquiryTitle.establishment")}
           </h2>

           <div className="space-y-5">
             {inquiryType === "plate" && (
               <>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-2">{t("home.labels.country")}</label>
                   <select 
                     value={plateSource}
                     onChange={(e) => setPlateSource(e.target.value)}
                     className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#004A80] appearance-none"
                   >
                     <option value="QAT">{lang === "ar" ? "قطر" : "Qatar"}</option>
                     <option value="KSA">{lang === "ar" ? "السعودية" : "Saudi Arabia"}</option>
                     <option value="KWT">{lang === "ar" ? "الكويت" : "Kuwait"}</option>
                     <option value="UAE">{lang === "ar" ? "الإمارات" : "UAE"}</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-2">{t("home.labels.plateType")}</label>
                   <select 
                     value={plateType}
                     onChange={(e) => setPlateType(e.target.value)}
                     className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#004A80] appearance-none"
                   >
                     <option value="1">{lang === "ar" ? "خصوصي" : "Private"}</option>
                     <option value="2">{lang === "ar" ? "نقل خاص" : "Private Transport"}</option>
                     <option value="3">{lang === "ar" ? "دراجة نارية" : "Motorcycle"}</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-2">{t("home.labels.plateNumber")}</label>
                   <input 
                     type="text" 
                     value={plateNumber}
                     onChange={(e) => setPlateNumber(e.target.value)}
                     placeholder={t("home.placeholders.plateNumber")}
                     className="w-full p-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#004A80] text-center"
                   />
                 </div>
                 
                 <div className="pt-2">
                    <label className="block text-sm font-bold text-[#004A80] mb-3">{t("home.labels.ownerData")}</label>
                    <div className="flex gap-6 mb-4">
                       <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "qid"} 
                            onChange={() => setOwnerIdType("qid")}
                            className="w-5 h-5 accent-[#004A80]"
                          />
                          <span className="font-medium text-gray-700">{t("home.labels.qidType")}</span>
                       </label>
                       <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "establishment"} 
                            onChange={() => setOwnerIdType("establishment")}
                            className="w-5 h-5 accent-[#004A80]"
                          />
                          <span className="font-medium text-gray-700">{t("home.labels.establishmentType")}</span>
                       </label>
                    </div>
                    <input 
                      type="text" 
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      placeholder={ownerIdType === "qid" ? t("home.placeholders.personalId") : t("home.placeholders.establishmentId")}
                      className="w-full p-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#004A80] text-center"
                    />
                 </div>
               </>
             )}

             {inquiryType !== "plate" && (
               <div>
                 <label className="block text-sm font-medium text-gray-600 mb-2">
                   {inquiryType === "qid" ? t("home.labels.personalId") : t("home.labels.establishmentId")}
                 </label>
                 <input 
                   type="text" 
                   value={ownerId}
                   onChange={(e) => setOwnerId(e.target.value)}
                   className="w-full p-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#004A80] text-center"
                 />
               </div>
             )}

             {/* Captcha Section */}
             <div className="flex items-center gap-3 pt-4">
                <input 
                  type="text" 
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-24 p-3.5 border border-gray-200 rounded-xl text-center font-bold text-lg"
                />
                <div className="flex-1 bg-gray-50 p-2 rounded-xl border border-gray-200 flex justify-between items-center px-4">
                   <img src="https://fees2.moi.gov.qa/moipay/captcha?t=123" alt="captcha" className="h-10" />
                   <button className="text-[#004A80] text-2xl hover:rotate-180 transition-transform duration-500">🔄</button>
                </div>
             </div>

             <div className="pt-6 space-y-4">
                <button 
                  onClick={handleSearch}
                  disabled={queryMutation.isPending}
                  className="w-full py-4.5 bg-[#004A80] text-white rounded-xl font-bold text-lg hover:bg-[#003A66] shadow-md active:scale-[0.98] transition-all"
                >
                  {queryMutation.isPending ? "جاري الاستعلام..." : t("home.buttons.search")}
                </button>
                <button 
                  onClick={() => {
                    setPlateNumber("");
                    setOwnerId("");
                    setCaptcha("");
                  }}
                  className="w-full py-4 border-2 border-[#004A80] text-[#004A80] rounded-xl font-bold text-lg hover:bg-blue-50 transition-all"
                >
                  {t("home.buttons.clear")}
                </button>
             </div>
           </div>
        </div>

        {/* Footer (Original App Style) */}
        <div className="mt-16 text-center pb-8">
           <h3 className="text-3xl font-black text-[#004A80] tracking-tight">{t("home.footer")}</h3>
           <div className="w-16 h-1 bg-[#8A1538] mx-auto my-4 rounded-full"></div>
           <p className="text-sm font-medium text-gray-400">{t("home.website")}</p>
        </div>
      </main>
    </div>
  );
}
