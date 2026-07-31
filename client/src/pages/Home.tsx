import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2,
  Globe,
  Menu,
  Wifi,
  Battery,
  Signal
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
      ownerId: ownerId,
      lang: lang as "ar" | "en",
    });
  };

  return (
    <div className="min-h-screen bg-[#E9F1F4] font-sans selection:bg-moi-blue/10" dir="rtl">
      {/* iOS-style Status Bar */}
      <div className="bg-[#008A95] px-6 py-2 flex justify-between items-center text-white text-xs font-bold sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu size={18} className="opacity-90" />
          <div className="flex items-center gap-1.5">
            <span>2:48</span>
            <div className="flex gap-0.5 items-end h-3">
              <div className="w-0.5 h-1 bg-white/40"></div>
              <div className="w-0.5 h-2 bg-white/40"></div>
              <div className="w-0.5 h-3 bg-white"></div>
              <div className="w-0.5 h-3 bg-white"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black">4G</span>
          <Wifi size={14} />
          <Battery size={18} className="rotate-180" />
        </div>
      </div>

      {/* Official Header */}
      <div className="bg-white px-6 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm sticky top-[36px] z-40">
        <div className="flex items-center">
           <img src="/qatar-payment-text.png" alt="Payment Gateway" className="h-10 md:h-12 object-contain" />
        </div>
        <div className="h-8 w-[1.5px] bg-gray-200 mx-4 rounded-full"></div>
        <div className="flex items-center">
           <img src="/qatar-moi-logo-new.png" alt="MOI Qatar" className="h-14 md:h-16 object-contain" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Language & Title Row */}
        <div className="flex items-center justify-between mb-8">
           <button className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 text-moi-blue shadow-sm hover:bg-white transition-all">
             English <Globe size={16} />
           </button>
           <h1 className="text-2xl font-black text-moi-blue tracking-tight">
             {lang === "ar" ? "الإستعلام عن المخالفات المرورية" : "Traffic Violations Inquiry"}
           </h1>
        </div>

        {/* Tabs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: "establishment", label: "قيد المنشأة", icon: "/icon-establishment.png" },
            { id: "qid", label: "الرقم الشخصي", icon: "/icon-qid.png" },
            { id: "plate", label: "رقم المركبة", icon: "/icon-plate.png" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setInquiryType(tab.id as any)}
              className={`moi-tab group ${inquiryType === tab.id ? "moi-tab-active" : ""}`}
            >
              <div className={`p-2 rounded-xl transition-all ${inquiryType === tab.id ? "bg-moi-blue/5 scale-110" : "group-hover:scale-105"}`}>
                <img src={tab.icon} alt="" className="w-12 h-12 object-contain" />
              </div>
              <span className={`text-[11px] mt-2 font-black transition-colors ${inquiryType === tab.id ? "text-moi-blue" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Inquiry Form Card */}
        <div className="moi-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-black text-moi-blue text-center mb-10 border-b border-gray-50 pb-6">
            {inquiryType === "plate" && "استعلام برقم المركبة"}
            {inquiryType === "qid" && "استعلام بالرقم الشخصي"}
            {inquiryType === "establishment" && "استعلام بقيد المنشأة"}
          </h2>

          <div className="space-y-6">
            {inquiryType === "plate" && (
              <>
                <div className="moi-input-group">
                  <label className="moi-label">البلد</label>
                  <select
                    value={plateSource}
                    onChange={(e) => setPlateSource(e.target.value)}
                    className="moi-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23004A80%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="QAT">قطر</option>
                    <option value="KSA">المملكة العربية السعودية</option>
                    <option value="KWT">الكويت</option>
                    <option value="UAE">الإمارات العربية المتحدة</option>
                  </select>
                </div>
                
                <div className="moi-input-group">
                  <label className="moi-label">نوع اللوحة</label>
                  <select
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="moi-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23004A80%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="1">خصوصي</option>
                    <option value="2">نقل خاص</option>
                    <option value="3">دراجة نارية</option>
                  </select>
                </div>

                <div className="moi-input-group">
                  <label className="moi-label">رقم اللوحة</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="الرجاء إدخال رقم المركبة"
                    className="moi-input"
                  />
                </div>
                
                <div className="pt-6 border-t border-gray-50 space-y-5">
                  <label className="block text-sm font-black text-moi-blue">بيانات المالك</label>
                  <div className="flex gap-8 px-2">
                    <label className="flex items-center gap-3 text-sm font-bold text-gray-600 cursor-pointer group">
                      <input
                        type="radio"
                        checked={ownerIdType === "qid"}
                        onChange={() => setOwnerIdType("qid")}
                        className="w-5 h-5 accent-moi-blue group-hover:scale-110 transition-transform"
                      />
                      رقم شخصي
                    </label>
                    <label className="flex items-center gap-3 text-sm font-bold text-gray-600 cursor-pointer group">
                      <input
                        type="radio"
                        checked={ownerIdType === "establishment"}
                        onChange={() => setOwnerIdType("establishment")}
                        className="w-5 h-5 accent-moi-blue group-hover:scale-110 transition-transform"
                      />
                      قيد منشأة
                    </label>
                  </div>
                  <input
                    type="text"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    placeholder={ownerIdType === "qid" ? "الرجاء إدخال الرقم الشخصي" : "الرجاء إدخال رقم المنشأة"}
                    className="moi-input"
                  />
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div className="moi-input-group">
                <label className="moi-label">
                  {inquiryType === "qid" ? "الرقم الشخصي" : "رقم قيد المنشأة"}
                </label>
                <input
                  type="text"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  placeholder={inquiryType === "qid" ? "أدخل الرقم الشخصي" : "أدخل رقم قيد المنشأة"}
                  className="moi-input"
                />
              </div>
            )}

            {/* Professional Captcha Section */}
            <div className="flex items-center gap-3 py-4">
              <input
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-28 p-4 border border-gray-200 rounded-2xl text-center font-black text-xl text-moi-blue shadow-inner"
                placeholder="0000"
              />
              <div className="flex-1 bg-gray-50/50 p-2 rounded-2xl flex justify-between items-center border border-gray-100 overflow-hidden relative group">
                <img 
                  src="https://fees2.moi.gov.qa/moipay/captcha?t=123" 
                  alt="captcha" 
                  className="h-12 object-contain mix-blend-multiply opacity-80" 
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='30' font-family='monospace' font-size='24' font-weight='bold' fill='%23004A80'%3E688QC%3C/text%3E%3C/svg%3E";
                  }} 
                />
                <button className="bg-white p-2 rounded-xl shadow-sm text-moi-blue hover:rotate-180 transition-transform duration-500 active:scale-90">
                   <Signal size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button
                onClick={handleSearch}
                disabled={queryMutation.isPending}
                className="moi-btn-primary"
              >
                {queryMutation.isPending ? <Loader2 className="animate-spin" /> : "استعلم"}
              </button>

              <button
                onClick={() => {
                  setPlateNumber("");
                  setOwnerId("");
                  setCaptcha("");
                }}
                className="moi-btn-secondary"
              >
                مسح
              </button>
            </div>
          </div>
        </div>

        {/* Professional Footer App Promo */}
        <div className="mt-20 text-center space-y-8">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-5xl font-black text-moi-blue tracking-tighter drop-shadow-sm">تطبيق مطراش</h3>
            <div className="w-24 h-1.5 bg-moi-blue rounded-full opacity-20"></div>
          </div>
          
          <div className="flex flex-col items-center gap-4 opacity-40">
             <p className="text-xs font-black tracking-widest text-gray-500 uppercase">fees2.moi.gov.qa</p>
             <div className="flex gap-4 grayscale">
                <div className="w-8 h-8 rounded-full border border-gray-300"></div>
                <div className="w-8 h-8 rounded-full border border-gray-300"></div>
                <div className="w-8 h-8 rounded-full border border-gray-300"></div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
