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
    <div className="min-h-screen bg-[#F0F4F8]" dir="rtl">
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
            الاستعلام عن المخالفات المرورية
          </h1>
        </div>

        {/* Inquiry Tabs - Clean usage of icons without extra text */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: "plate", icon: "/icon-plate.png" },
            { id: "qid", icon: "/icon-qid.png" },
            { id: "establishment", icon: "/icon-establishment.png" }
          ].map((tab) => {
            const isActive = inquiryType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInquiryType(tab.id as any)}
                className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all bg-white h-32 ${
                  isActive ? "border-[#003E66] shadow-md" : "border-transparent shadow-sm"
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
        <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#003E66] text-center mb-8">
            {inquiryType === "plate" && "استعلام برقم المركبة"}
            {inquiryType === "qid" && "استعلام بالرقم الشخصي"}
            {inquiryType === "establishment" && "استعلام بقيد المنشأة"}
          </h2>

          <div className="space-y-6">
            {inquiryType === "plate" && (
              <>
                <div className="flex flex-col items-end">
                  <label className="text-sm font-bold text-gray-700 mb-2">البلد</label>
                  <select 
                    value={plateSource}
                    onChange={(e) => setPlateSource(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#003E66] text-right appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="QAT">قطر</option>
                  </select>
                </div>
                <div className="flex flex-col items-end">
                  <label className="text-sm font-bold text-gray-700 mb-2">نوع اللوحة</label>
                  <select 
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#003E66] text-right appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="1">خصوصي</option>
                  </select>
                </div>
                <div className="flex flex-col items-end">
                  <label className="text-sm font-bold text-gray-700 mb-2">رقم اللوحة</label>
                  <input 
                    type="text" 
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="الرجاء إدخال رقم المركبة"
                    className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-[#003E66] text-center"
                  />
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-bold text-[#003E66] mb-4 text-right">بيانات المالك</label>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-end gap-3 cursor-pointer">
                      <span className="font-medium text-gray-700">رقم شخصي</span>
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
                      placeholder="الرجاء إدخال الرقم الشخصي"
                      className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-[#003E66] text-center"
                    />
                    <label className="flex items-center justify-end gap-3 cursor-pointer">
                      <span className="font-medium text-gray-700">قيد منشأة</span>
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
              <div className="flex flex-col items-end">
                <label className="text-sm font-bold text-gray-700 mb-2">
                  {inquiryType === "qid" ? "الرقم الشخصي" : "قيد المنشأة"}
                </label>
                <input 
                  type="text" 
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-[#003E66] text-center text-lg"
                />
              </div>
            )}

            {/* Captcha Section */}
            <div className="flex items-center gap-3 pt-4">
              <input 
                type="text" 
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-24 p-4 border border-gray-300 rounded-xl text-center font-bold text-xl"
              />
              <div className="flex-1 bg-gray-50 p-2 rounded-xl border border-gray-300 flex justify-between items-center px-4 h-16">
                <img src={`https://fees2.moi.gov.qa/moipay/captcha?t=${Date.now()}`} alt="captcha" className="h-full" />
                <div className="flex gap-3">
                  <button className="text-[#003E66] text-2xl">🔄</button>
                  <button className="text-[#003E66] text-2xl">🔊</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <button 
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="w-full py-5 bg-[#003E66] text-white rounded-xl font-bold text-xl hover:bg-[#002A44] transition-all shadow-sm"
              >
                {queryMutation.isPending ? "جاري الاستعلام..." : "استعلم"}
              </button>
              <button 
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                }}
                className="w-full py-5 border-2 border-[#003E66] text-[#003E66] rounded-xl font-bold text-xl hover:bg-blue-50 transition-all"
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
