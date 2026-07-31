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
    <div className="min-h-screen bg-[#E9F1F4]" dir="rtl">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Language & Menu Row */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-4">
          <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-[#003E66] font-medium"
          >
            <span className="text-lg">English</span>
            <span className="bg-[#003E66] text-white p-1 rounded text-xs font-bold">A文</span>
          </button>
          <button className="p-2 text-[#003E66]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-[26px] font-bold text-[#003E66]">
            الاستعلام عن المخالفات المرورية
          </h1>
        </div>

        {/* Inquiry Tabs - Correct Order: Plate (Right), QID (Center), Establishment (Left) */}
        <div className="grid grid-cols-3 gap-6 mb-10">
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
                className={`flex flex-col items-center justify-center transition-all h-36 w-full ${
                  isActive ? "border-2 border-[#003E66] rounded-3xl bg-white shadow-md scale-105" : "border-2 border-transparent"
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
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <h2 className="text-[22px] font-bold text-[#003E66] text-center mb-10">
            {inquiryType === "plate" && "استعلام برقم المركبة"}
            {inquiryType === "qid" && "استعلام بالرقم الشخصي"}
            {inquiryType === "establishment" && "استعلام بقيد المنشأة"}
          </h2>

          <div className="space-y-8">
            {inquiryType === "plate" && (
              <>
                <div className="flex flex-col items-end">
                  <label className="text-[17px] font-bold text-gray-700 mb-3">البلد</label>
                  <div className="relative w-full">
                    <select 
                      value={plateSource}
                      onChange={(e) => setPlateSource(e.target.value)}
                      className="w-full p-5 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-right appearance-none font-bold text-lg"
                    >
                      <option value="QAT">قطر</option>
                    </select>
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <label className="text-[17px] font-bold text-gray-700 mb-3">نوع اللوحة</label>
                  <div className="relative w-full">
                    <select 
                      value={plateType}
                      onChange={(e) => setPlateType(e.target.value)}
                      className="w-full p-5 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-right appearance-none font-bold text-lg"
                    >
                      <option value="1">خصوصي</option>
                    </select>
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <label className="text-[17px] font-bold text-gray-700 mb-3">رقم اللوحة</label>
                  <input 
                    type="text" 
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="الرجاء إدخال رقم المركبة"
                    className="w-full p-5 border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-center font-bold text-lg placeholder:text-gray-300"
                  />
                </div>
                
                <div className="pt-6">
                  <label className="block text-[18px] font-bold text-[#003E66] mb-6 text-right">بيانات المالك</label>
                  <div className="space-y-6">
                    <div className="flex items-center justify-end gap-4 cursor-pointer" onClick={() => setOwnerIdType("qid")}>
                      <span className="font-bold text-gray-700 text-[17px]">رقم شخصي</span>
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${ownerIdType === "qid" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "qid" && <div className="w-4 h-4 rounded-full bg-[#003E66]"></div>}
                      </div>
                    </div>
                    
                    {ownerIdType === "qid" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder="الرجاء إدخال الرقم الشخصي"
                        className="w-full p-5 border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-center font-bold text-lg placeholder:text-gray-300"
                      />
                    )}

                    <div className="flex items-center justify-end gap-4 cursor-pointer" onClick={() => setOwnerIdType("establishment")}>
                      <span className="font-bold text-gray-700 text-[17px]">قيد منشأة</span>
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${ownerIdType === "establishment" ? "border-[#003E66]" : "border-gray-300"}`}>
                        {ownerIdType === "establishment" && <div className="w-4 h-4 rounded-full bg-[#003E66]"></div>}
                      </div>
                    </div>

                    {ownerIdType === "establishment" && (
                      <input 
                        type="text" 
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder="الرجاء إدخال قيد المنشأة"
                        className="w-full p-5 border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-center font-bold text-lg placeholder:text-gray-300"
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div className="flex flex-col items-end">
                <label className="text-[17px] font-bold text-gray-700 mb-3">
                  {inquiryType === "qid" ? "الرقم الشخصي" : "قيد المنشأة"}
                </label>
                <input 
                  type="text" 
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full p-5 border border-gray-200 rounded-2xl outline-none focus:border-[#003E66] text-center text-xl font-bold"
                />
              </div>
            )}

            {/* Captcha Section */}
            <div className="flex items-center gap-4 pt-8">
              <input 
                type="text" 
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-32 p-5 border border-gray-200 rounded-2xl text-center font-bold text-2xl"
              />
              <div className="flex-1 bg-[#F8FAFC] p-3 rounded-2xl border border-gray-200 flex justify-between items-center px-6 h-20">
                <img src={`https://fees2.moi.gov.qa/moipay/captcha?t=${Date.now()}`} alt="captcha" className="h-full object-contain" />
                <div className="flex gap-5">
                  <button className="text-[#003E66] text-3xl hover:scale-110 transition-transform">🔄</button>
                  <button className="text-[#003E66] text-3xl hover:scale-110 transition-transform">🔊</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-10 space-y-5">
              <button 
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="w-full py-6 bg-[#003E66] text-white rounded-2xl font-bold text-[22px] hover:bg-[#002A44] transition-all shadow-lg active:scale-[0.98]"
              >
                {queryMutation.isPending ? "جاري الاستعلام..." : "استعلم"}
              </button>
              <button 
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                }}
                className="w-full py-6 border-2 border-[#003E66] text-[#003E66] rounded-2xl font-bold text-[22px] hover:bg-blue-50 transition-all active:scale-[0.98]"
              >
                مسح
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
