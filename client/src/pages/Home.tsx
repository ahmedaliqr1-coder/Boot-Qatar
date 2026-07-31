import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
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
    <div className="min-h-screen bg-[#F0F4F8]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Language & Menu Row */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-[#003E66] font-medium"
          >
            <span className="text-lg">{lang === "ar" ? "English" : "العربية"}</span>
            <span className="bg-[#003E66] text-white p-1 rounded text-xs font-bold">A文</span>
          </button>
          <button className="p-2 text-[#003E66]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#003E66]">
            {t("home.title")}
          </h1>
        </div>

        {/* Inquiry Tabs with Transparent Images */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: "plate", label: lang === "ar" ? "رقم المركبة" : "Plate Number", icon: "/icon-plate.png" },
            { id: "qid", label: lang === "ar" ? "الرقم الشخصي" : "الرقم الشخصي", icon: "/icon-qid.png" },
            { id: "establishment", label: lang === "ar" ? "قيد المنشأة" : "Establishment ID", icon: "/icon-establishment.png" }
          ].map((tab) => {
            const isActive = inquiryType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInquiryType(tab.id as any)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all bg-white h-32 ${
                  isActive ? "border-[#003E66] shadow-md" : "border-transparent shadow-sm"
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={tab.icon} 
                    alt={tab.label} 
                    className={`max-w-full max-h-full object-contain ${isActive ? "" : "opacity-60 grayscale"}`}
                  />
                </div>
                <span className={`text-sm font-bold mt-2 ${isActive ? "text-[#003E66]" : "text-gray-500"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inquiry Form Card */}
        <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#003E66] text-center mb-8">
            {inquiryType === "plate" && (lang === "ar" ? "استعلام برقم المركبة" : "Inquiry by Plate Number")}
            {inquiryType === "qid" && (lang === "ar" ? "استعلام بالرقم الشخصي" : "Inquiry by Personal ID")}
            {inquiryType === "establishment" && (lang === "ar" ? "استعلام بقيد المنشأة" : "Inquiry by Establishment ID")}
          </h2>

          <div className="space-y-6">
            {inquiryType === "plate" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-right">{lang === "ar" ? "البلد" : "Country"}</label>
                  <select 
                    value={plateSource}
                    onChange={(e) => setPlateSource(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#003E66] text-right"
                  >
                    <option value="QAT">{lang === "ar" ? "قطر" : "Qatar"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-right">{lang === "ar" ? "نوع اللوحة" : "Plate Type"}</label>
                  <select 
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#003E66] text-right"
                  >
                    <option value="1">{lang === "ar" ? "خصوصي" : "Private"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-right">{lang === "ar" ? "رقم اللوحة" : "Plate Number"}</label>
                  <input 
                    type="text" 
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={lang === "ar" ? "الرجاء إدخال رقم المركبة" : "Please enter plate number"}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#003E66] text-center"
                  />
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-bold text-[#003E66] mb-4 text-right">{lang === "ar" ? "بيانات المالك" : "Owner Data"}</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-end gap-3 cursor-pointer">
                      <span className="font-medium text-gray-700">{lang === "ar" ? "رقم شخصي" : "Personal ID"}</span>
                      <input 
                        type="radio" 
                        checked={ownerIdType === "qid"} 
                        onChange={() => setOwnerIdType("qid")}
                        className="w-5 h-5 accent-[#003E66]"
                      />
                    </label>
                    <input 
                      type="text" 
                      value={ownerIdType === "qid" ? ownerId : ""}
                      onChange={(e) => ownerIdType === "qid" && setOwnerId(e.target.value)}
                      placeholder={lang === "ar" ? "الرجاء إدخال الرقم الشخصي" : "Please enter Personal ID"}
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#003E66] text-center mb-2"
                    />
                    <label className="flex items-center justify-end gap-3 cursor-pointer">
                      <span className="font-medium text-gray-700">{lang === "ar" ? "قيد منشأة" : "Establishment ID"}</span>
                      <input 
                        type="radio" 
                        checked={ownerIdType === "establishment"} 
                        onChange={() => setOwnerIdType("establishment")}
                        className="w-5 h-5 accent-[#003E66]"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
                  {inquiryType === "qid" ? (lang === "ar" ? "الرقم الشخصي" : "Personal ID") : (lang === "ar" ? "قيد المنشأة" : "Establishment ID")}
                </label>
                <input 
                  type="text" 
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#003E66] text-center text-lg"
                />
              </div>
            )}

            {/* Captcha Section */}
            <div className="flex items-center gap-3 pt-4">
              <input 
                type="text" 
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-24 p-3 border border-gray-300 rounded-lg text-center font-bold text-xl"
              />
              <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-300 flex justify-between items-center px-4 h-14">
                <img src={`https://fees2.moi.gov.qa/moipay/captcha?t=${Date.now()}`} alt="captcha" className="h-full" />
                <div className="flex gap-2">
                  <button className="text-[#003E66] text-xl">🔄</button>
                  <button className="text-[#003E66] text-xl">🔊</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <button 
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="w-full py-4 bg-[#003E66] text-white rounded-lg font-bold text-xl hover:bg-[#002A44] transition-all shadow-sm"
              >
                {queryMutation.isPending ? (lang === "ar" ? "جاري الاستعلام..." : "Searching...") : (lang === "ar" ? "استعلم" : "Search")}
              </button>
              <button 
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                }}
                className="w-full py-4 border-2 border-[#003E66] text-[#003E66] rounded-lg font-bold text-xl hover:bg-blue-50 transition-all"
              >
                {lang === "ar" ? "مسح" : "Clear"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
