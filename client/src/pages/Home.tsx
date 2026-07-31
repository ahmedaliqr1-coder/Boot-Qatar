import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  Globe,
  Menu
} from "lucide-react";

export default function Home() {
  const { lang } = useLanguage();
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
          toast.info(lang === "ar" ? "لا توجد مخالفات مسجلة" : "No violations recorded");
        } else {
          setLocation(`/payment?session=${data.sessionId}`);
        }
      } else {
        toast.error(data.errorMessage || "فشل الاستعلام");
      }
    },
  });

  const handleSearch = () => {
    if (inquiryType === "plate" && !plateNumber) {
      toast.error(lang === "ar" ? "يرجى إدخال رقم اللوحة" : "Please enter plate number");
      return;
    }
    queryMutation.mutate({
      inquiryType,
      plateSource: inquiryType === "plate" ? plateSource : undefined,
      plateNumber: inquiryType === "plate" ? plateNumber : undefined,
      plateType: inquiryType === "plate" ? plateType : undefined,
      ownerIdType: inquiryType === "plate" ? ownerIdType : (inquiryType === "qid" ? "qid" : "establishment"),
      ownerId: inquiryType === "plate" ? ownerId : ownerId,
      lang: lang as "ar" | "en",
    });
  };

  return (
    <div className="min-h-screen bg-[#E9F1F4] font-sans rtl" dir="rtl">
      {/* Top Header Bar */}
      <header className="bg-[#008A95] p-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <Menu size={24} />
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">2:48</span>
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-white opacity-40"></div>
              <div className="w-1 h-3 bg-white"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">4G</span>
          <div className="w-5 h-2.5 border border-white rounded-sm relative">
            <div className="absolute left-0 top-0 h-full bg-white w-3/4"></div>
          </div>
        </div>
      </header>

      {/* Main MOI Logo Header */}
      <div className="bg-white py-4 px-6 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
           <img src="/qatar-payment-text.png" alt="Payment Gateway" className="h-12 object-contain" />
        </div>
        <div className="h-10 w-[1px] bg-gray-300 mx-2"></div>
        <div className="flex items-center">
           <img src="/qatar-moi-logo-new.png" alt="MOI Qatar" className="h-16 object-contain" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
           <button className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 text-[#004A80]">
             English <Globe size={14} />
           </button>
           <h1 className="text-xl font-bold text-[#004A80]">
             {lang === "ar" ? "الإستعلام عن المخالفات المرورية" : "Traffic Violations Inquiry"}
           </h1>
        </div>

        {/* Tabs Row */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setInquiryType("establishment")}
            className={`w-24 h-24 flex flex-col items-center justify-center rounded-2xl border transition-all ${
              inquiryType === "establishment" ? "border-[#004A80] bg-white shadow-md ring-1 ring-[#004A80]" : "border-transparent bg-white shadow-sm"
            }`}
          >
            <img src="/icon-establishment.png" alt="" className="w-12 h-12 object-contain" />
            <span className="text-[10px] mt-1 text-gray-600 font-bold">قيد المنشأة</span>
          </button>
          
          <button
            onClick={() => setInquiryType("qid")}
            className={`w-24 h-24 flex flex-col items-center justify-center rounded-2xl border transition-all ${
              inquiryType === "qid" ? "border-[#004A80] bg-white shadow-md ring-1 ring-[#004A80]" : "border-transparent bg-white shadow-sm"
            }`}
          >
            <img src="/icon-qid.png" alt="" className="w-12 h-12 object-contain" />
            <span className="text-[10px] mt-1 text-gray-600 font-bold">الرقم الشخصي</span>
          </button>

          <button
            onClick={() => setInquiryType("plate")}
            className={`w-24 h-24 flex flex-col items-center justify-center rounded-2xl border transition-all ${
              inquiryType === "plate" ? "border-[#004A80] bg-white shadow-md ring-1 ring-[#004A80]" : "border-transparent bg-white shadow-sm"
            }`}
          >
            <img src="/icon-plate.png" alt="" className="w-12 h-12 object-contain" />
            <span className="text-[10px] mt-1 text-gray-600 font-bold">رقم المركبة</span>
          </button>
        </div>

        {/* Inquiry Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#004A80] text-center mb-8">
            {inquiryType === "plate" && "استعلام برقم المركبة"}
            {inquiryType === "qid" && "استعلام بالرقم الشخصي"}
            {inquiryType === "establishment" && "استعلام بقيد المنشأة"}
          </h2>

          <div className="space-y-6">
            {inquiryType === "plate" && (
              <>
                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 text-left">البلد</label>
                  <select
                    value={plateSource}
                    onChange={(e) => setPlateSource(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#004A80]"
                  >
                    <option value="QAT">قطر</option>
                    <option value="KSA">السعودية</option>
                    <option value="KWT">الكويت</option>
                    <option value="UAE">الإمارات</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 text-left">نوع اللوحة</label>
                  <select
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#004A80]"
                  >
                    <option value="1">خصوصي</option>
                    <option value="2">نقل خاص</option>
                    <option value="3">دراجة نارية</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm text-gray-500 text-left">رقم اللوحة</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="الرجاء إدخال رقم المركبة"
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#004A80]"
                  />
                </div>
                
                <div className="pt-4 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">بيانات المالك</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        checked={ownerIdType === "qid"}
                        onChange={() => setOwnerIdType("qid")}
                        className="w-5 h-5 accent-[#004A80]"
                      />
                      رقم شخصي
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        checked={ownerIdType === "establishment"}
                        onChange={() => setOwnerIdType("establishment")}
                        className="w-5 h-5 accent-[#004A80]"
                      />
                      قيد منشأة
                    </label>
                  </div>
                  <input
                    type="text"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    placeholder={ownerIdType === "qid" ? "الرجاء إدخال الرقم الشخصي" : "الرجاء إدخال رقم المنشأة"}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#004A80]"
                  />
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div className="space-y-1">
                <label className="block text-sm text-gray-500 text-left">
                  {inquiryType === "qid" ? "الرقم الشخصي" : "رقم قيد المنشأة"}
                </label>
                <input
                  type="text"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#004A80]"
                />
              </div>
            )}

            {/* Captcha */}
            <div className="flex items-center gap-4 py-2">
              <input
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-28 p-3 border border-gray-200 rounded-lg text-center font-bold"
              />
              <div className="flex-1 bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <img src="https://fees2.moi.gov.qa/moipay/captcha?t=123" alt="captcha" className="h-10 opacity-70" onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40'%3E%3Ctext x='10' y='30' font-family='monospace' font-size='20' fill='%23666'%3E688QC%3C/text%3E%3C/svg%3E";
                }} />
                <button className="text-[#004A80] p-1">
                   <Globe size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="w-full py-5 bg-[#004A80] text-white rounded-xl font-bold text-lg hover:bg-[#003A66] transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-100"
              >
                {queryMutation.isPending ? <Loader2 className="animate-spin" /> : "استعلم"}
              </button>

              <button
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                }}
                className="w-full py-4 border border-[#004A80] text-[#004A80] rounded-xl font-bold hover:bg-blue-50 transition-all"
              >
                مسح
              </button>
            </div>
          </div>
        </div>

        {/* Footer App Promo */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="text-4xl font-black text-[#004A80] tracking-tighter">تطبيق مطراش</h3>
          <div className="flex flex-col items-center">
             <div className="w-full h-1 bg-[#004A80] opacity-20 mb-2"></div>
             <p className="text-sm text-gray-400 font-medium">fees2.moi.gov.qa</p>
          </div>
        </div>
      </main>
    </div>
  );
}
