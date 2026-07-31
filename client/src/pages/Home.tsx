import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [inquiryType, setInquiryType] = useState<"plate" | "qid" | "establishment">("plate");
  const [plateSource, setPlateSource] = useState("قطر");
  const [plateType, setPlateType] = useState("خصوصي");
  const [plateNumber, setPlateNumber] = useState("");
  const [ownerIdType, setOwnerIdType] = useState<"qid" | "establishment">("qid");
  const [ownerId, setOwnerId] = useState("");
  const [captcha, setCaptcha] = useState("");
  
  const queryMutation = trpc.fines.query.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        if (data.totalFines === 0) {
          toast.info("لا توجد مخالفات مسجلة");
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
      toast.error("الرجاء إدخال رقم اللوحة");
      return;
    }
    queryMutation.mutate({
      inquiryType,
      plateSource,
      plateNumber,
      plateType,
      ownerIdType: inquiryType === "plate" ? ownerIdType : (inquiryType === "qid" ? "qid" : "establishment"),
      ownerId: ownerId,
      lang: "ar",
    });
  };

  return (
    <div className="min-h-screen bg-[#E9F1F4]" dir="rtl">
      {/* Top Teal Bar */}
      <div className="bg-[#008A95] h-12 w-full flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-4">
           <span className="text-xl">☰</span>
           <span className="text-sm font-bold">2:48</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs">4G</span>
           <div className="flex gap-0.5 items-end h-3">
              <div className="w-0.5 h-1 bg-white/40"></div>
              <div className="w-0.5 h-2 bg-white/40"></div>
              <div className="w-0.5 h-3 bg-white"></div>
           </div>
        </div>
      </div>

      {/* Main Header with Logos */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
         <div className="flex items-center">
            <img src="/qatar-payment-text.png" alt="Payment Gateway" className="h-10" />
         </div>
         <div className="h-8 w-[1px] bg-red-800 mx-2"></div>
         <div className="flex items-center">
            <img src="/qatar-moi-logo-new.png" alt="MOI Qatar" className="h-12" />
         </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Inquiry Title Row */}
        <div className="flex justify-between items-center my-6">
           <button className="border border-gray-300 rounded px-2 py-1 text-sm flex items-center gap-1 bg-white text-[#004A80]">
             English 🌐
           </button>
           <h1 className="text-xl font-bold text-[#004A80]">الإستعلام عن المخالفات المرورية</h1>
        </div>

        {/* Tabs Row */}
        <div className="flex justify-center gap-4 mb-6">
           <button 
             onClick={() => setInquiryType("establishment")}
             className={`qatar-tab ${inquiryType === "establishment" ? "qatar-tab-active" : ""}`}
           >
             <img src="/icon-establishment.png" alt="" className="w-10 h-10 mb-1" />
             <span className="text-xs font-bold text-gray-600">قيد المنشأة</span>
           </button>
           
           <button 
             onClick={() => setInquiryType("qid")}
             className={`qatar-tab ${inquiryType === "qid" ? "qatar-tab-active" : ""}`}
           >
             <img src="/icon-qid.png" alt="" className="w-10 h-10 mb-1" />
             <span className="text-xs font-bold text-gray-600">الرقم الشخصي</span>
           </button>

           <button 
             onClick={() => setInquiryType("plate")}
             className={`qatar-tab ${inquiryType === "plate" ? "qatar-tab-active" : ""}`}
           >
             <img src="/icon-plate.png" alt="" className="w-10 h-10 mb-1" />
             <span className="text-xs font-bold text-gray-600">رقم المركبة</span>
           </button>
        </div>

        {/* Main Card */}
        <div className="qatar-card">
           <h2 className="text-lg font-bold text-[#004A80] text-center mb-6">
             {inquiryType === "plate" && "استعلام برقم المركبة"}
             {inquiryType === "qid" && "استعلام بالرقم الشخصي"}
             {inquiryType === "establishment" && "استعلام بقيد المنشأة"}
           </h2>

           <div className="space-y-4">
             {inquiryType === "plate" && (
               <>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">البلد</label>
                   <select 
                     value={plateSource}
                     onChange={(e) => setPlateSource(e.target.value)}
                     className="qatar-input"
                   >
                     <option>قطر</option>
                     <option>السعودية</option>
                     <option>الكويت</option>
                     <option>الإمارات</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">نوع اللوحة</label>
                   <select 
                     value={plateType}
                     onChange={(e) => setPlateType(e.target.value)}
                     className="qatar-input"
                   >
                     <option>خصوصي</option>
                     <option>نقل خاص</option>
                     <option>دراجة نارية</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">رقم اللوحة</label>
                   <input 
                     type="text" 
                     value={plateNumber}
                     onChange={(e) => setPlateNumber(e.target.value)}
                     placeholder="الرجاء إدخال رقم المركبة" 
                     className="qatar-input"
                   />
                 </div>
                 
                 <div className="pt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">بيانات المالك</label>
                    <div className="flex gap-4 mb-3">
                       <label className="flex items-center gap-1 text-sm">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "qid"} 
                            onChange={() => setOwnerIdType("qid")}
                            className="accent-[#004A80]"
                          />
                          رقم شخصي
                       </label>
                       <label className="flex items-center gap-1 text-sm">
                          <input 
                            type="radio" 
                            checked={ownerIdType === "establishment"} 
                            onChange={() => setOwnerIdType("establishment")}
                            className="accent-[#004A80]"
                          />
                          قيد منشأة
                       </label>
                    </div>
                    <input 
                      type="text" 
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      placeholder={ownerIdType === "qid" ? "الرجاء إدخال الرقم الشخصي" : "الرجاء إدخال رقم المنشأة"} 
                      className="qatar-input"
                    />
                 </div>
               </>
             )}

             {inquiryType !== "plate" && (
               <div>
                 <label className="block text-sm text-gray-500 mb-1">
                   {inquiryType === "qid" ? "الرقم الشخصي" : "رقم قيد المنشأة"}
                 </label>
                 <input 
                   type="text" 
                   value={ownerId}
                   onChange={(e) => setOwnerId(e.target.value)}
                   className="qatar-input"
                 />
               </div>
             )}

             {/* Captcha Section */}
             <div className="flex items-center gap-2 pt-2">
                <input 
                  type="text" 
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-20 qatar-input text-center"
                />
                <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-200 flex justify-between items-center">
                   <img src="https://fees2.moi.gov.qa/moipay/captcha?t=123" alt="captcha" className="h-8" />
                   <button className="text-[#004A80] text-xl">🔄</button>
                </div>
             </div>

             <div className="pt-4 space-y-3">
                <button 
                  onClick={handleSearch}
                  disabled={queryMutation.isPending}
                  className="qatar-btn-primary"
                >
                  {queryMutation.isPending ? "جاري الاستعلام..." : "استعلم"}
                </button>
                <button 
                  onClick={() => {
                    setPlateNumber("");
                    setOwnerId("");
                    setCaptcha("");
                  }}
                  className="qatar-btn-secondary"
                >
                  مسح
                </button>
             </div>
           </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-center">
           <h3 className="text-3xl font-bold text-[#004A80]">تطبيق مطراش</h3>
           <div className="w-full h-[1px] bg-[#004A80] my-4 opacity-20"></div>
           <p className="text-xs text-gray-400">fees2.moi.gov.qa</p>
        </div>
      </div>
    </div>
  );
}
