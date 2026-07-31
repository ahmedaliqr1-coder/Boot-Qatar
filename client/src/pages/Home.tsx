import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  CreditCard,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Globe,
  User,
  Building2,
  Car
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const QATAR_MOI_LOGO = "/qatar-moi-logo.png";
const QATAR_HEADER_IMAGE = "/qatar-header-full.jpg";

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
    if (inquiryType !== "plate" && !ownerId) {
      toast.error(lang === "ar" ? "يرجى إدخال الرقم المطلوب" : "Please enter required ID");
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
    <div className="min-h-screen bg-[#F8F9FA] font-sans rtl" dir="rtl">
      {/* Header Image */}
      <div className="w-full">
        <img src={QATAR_HEADER_IMAGE} alt="MOI Header" className="w-full h-auto object-contain shadow-sm" />
      </div>

      <main className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#004A80] text-center mb-8">
          {lang === "ar" ? "الاستعلام عن المخالفات المرورية" : "Traffic Violations Inquiry"}
        </h1>

        {/* Inquiry Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <button
            onClick={() => setInquiryType("plate")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              inquiryType === "plate" ? "border-[#004A80] bg-white shadow-md" : "border-transparent bg-gray-50"
            }`}
          >
            <Car className={inquiryType === "plate" ? "text-[#004A80]" : "text-gray-400"} />
            <span className={`text-xs mt-2 ${inquiryType === "plate" ? "text-[#004A80] font-bold" : "text-gray-500"}`}>
              {lang === "ar" ? "رقم المركبة" : "Vehicle Plate"}
            </span>
          </button>
          <button
            onClick={() => setInquiryType("qid")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              inquiryType === "qid" ? "border-[#004A80] bg-white shadow-md" : "border-transparent bg-gray-50"
            }`}
          >
            <User className={inquiryType === "qid" ? "text-[#004A80]" : "text-gray-400"} />
            <span className={`text-xs mt-2 ${inquiryType === "qid" ? "text-[#004A80] font-bold" : "text-gray-500"}`}>
              {lang === "ar" ? "الرقم الشخصي" : "QID Number"}
            </span>
          </button>
          <button
            onClick={() => setInquiryType("establishment")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              inquiryType === "establishment" ? "border-[#004A80] bg-white shadow-md" : "border-transparent bg-gray-50"
            }`}
          >
            <Building2 className={inquiryType === "establishment" ? "text-[#004A80]" : "text-gray-400"} />
            <span className={`text-xs mt-2 ${inquiryType === "establishment" ? "text-[#004A80] font-bold" : "text-gray-500"}`}>
              {lang === "ar" ? "قيد المنشأة" : "Establishment"}
            </span>
          </button>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#004A80] text-center mb-6">
            {inquiryType === "plate" && (lang === "ar" ? "استعلام برقم المركبة" : "Inquiry by Vehicle Plate")}
            {inquiryType === "qid" && (lang === "ar" ? "استعلام بالرقم الشخصي" : "Inquiry by QID")}
            {inquiryType === "establishment" && (lang === "ar" ? "استعلام بقيد المنشأة" : "Inquiry by Establishment")}
          </h2>

          <div className="space-y-4">
            {inquiryType === "plate" && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{lang === "ar" ? "البلد" : "Country"}</label>
                  <select
                    value={plateSource}
                    onChange={(e) => setPlateSource(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  >
                    <option value="QAT">قطر</option>
                    <option value="KSA">السعودية</option>
                    <option value="KWT">الكويت</option>
                    <option value="UAE">الإمارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{lang === "ar" ? "نوع اللوحة" : "Plate Type"}</label>
                  <select
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  >
                    <option value="1">خصوصي</option>
                    <option value="2">نقل خاص</option>
                    <option value="3">دراجة نارية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{lang === "ar" ? "رقم اللوحة" : "Plate Number"}</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={lang === "ar" ? "الرجاء إدخال رقم المركبة" : "Please enter plate number"}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3">{lang === "ar" ? "بيانات المالك" : "Owner Details"}</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        checked={ownerIdType === "qid"}
                        onChange={() => setOwnerIdType("qid")}
                        className="text-[#004A80]"
                      />
                      {lang === "ar" ? "رقم شخصي" : "QID"}
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        checked={ownerIdType === "establishment"}
                        onChange={() => setOwnerIdType("establishment")}
                        className="text-[#004A80]"
                      />
                      {lang === "ar" ? "قيد منشأة" : "Establishment"}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    placeholder={ownerIdType === "qid" ? (lang === "ar" ? "الرجاء إدخال الرقم الشخصي" : "Enter QID") : (lang === "ar" ? "الرجاء إدخال رقم المنشأة" : "Enter Establishment ID")}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </>
            )}

            {inquiryType !== "plate" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {inquiryType === "qid" ? (lang === "ar" ? "الرقم الشخصي" : "QID Number") : (lang === "ar" ? "رقم قيد المنشأة" : "Establishment ID")}
                </label>
                <input
                  type="text"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                />
              </div>
            )}

            {/* Captcha Simulation */}
            <div className="flex items-center gap-2 py-4">
              <input
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                placeholder="688QC"
                className="w-24 p-2 border border-gray-200 rounded text-center font-mono"
              />
              <div className="bg-gray-100 p-2 rounded flex-1 flex justify-center items-center select-none opacity-60 grayscale italic font-bold tracking-widest text-lg">
                688QC
              </div>
              <button className="p-2 text-gray-400 hover:text-[#004A80]">
                <Globe size={20} />
              </button>
            </div>

            <button
              onClick={handleSearch}
              disabled={queryMutation.isPending}
              className="w-full py-4 bg-[#004A80] text-white rounded-lg font-bold hover:bg-[#003A66] transition-colors flex justify-center items-center gap-2 shadow-lg"
            >
              {queryMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  {lang === "ar" ? "استعلم" : "Inquire"}
                </>
              )}
            </button>

            <button
              onClick={() => {
                setPlateNumber("");
                setOwnerId("");
                setCaptcha("");
              }}
              className="w-full py-4 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              {lang === "ar" ? "مسح" : "Clear"}
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-3xl font-black text-[#004A80] tracking-tight">تطبيق مطراش</h3>
          <p className="text-sm text-gray-500 font-mono">fees2.moi.gov.qa</p>
        </div>
      </main>
    </div>
  );
}
