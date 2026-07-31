import React, { useState } from "react";
import { useLocation } from "wouter";
import { Building2, User, Car, Volume2, RotateCcw, Eye, EyeOff } from "lucide-react";

type QueryType = "establishment" | "personal" | "vehicle";
type OwnerIdType = "personal" | "establishment";

interface QueryState {
  queryType: QueryType;
  ownerIdType: OwnerIdType;
  
  // For personal ID query
  personalId: string;
  
  // For establishment query
  establishmentId: string;
  
  // For vehicle query
  country: string;
  plateType: string;
  plateNumber: string;
  vehicleOwnerId: string;
  vehicleOwnerIdType: OwnerIdType;
  
  // Captcha
  captchaCode: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState<QueryState>({
    queryType: "vehicle",
    ownerIdType: "personal",
    personalId: "",
    establishmentId: "",
    country: "qatar",
    plateType: "private",
    plateNumber: "",
    vehicleOwnerId: "",
    vehicleOwnerIdType: "personal",
    captchaCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (tab: QueryType) => {
    setQuery(prev => ({ ...prev, queryType: tab }));
  };

  const handleInputChange = (field: string, value: string) => {
    setQuery(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setQuery(prev => ({
      ...prev,
      personalId: "",
      establishmentId: "",
      plateNumber: "",
      vehicleOwnerId: "",
      captchaCode: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Store query data for payment page
      const payload = {
        queryType: query.queryType,
        plateNumber: query.queryType === "vehicle" ? query.plateNumber : "",
        plateSource: "QAT",
        ownerId: query.queryType === "vehicle" ? query.vehicleOwnerId : (query.queryType === "personal" ? query.personalId : query.establishmentId),
        ownerIdType: query.queryType === "vehicle" ? query.vehicleOwnerIdType : query.ownerIdType,
      };
      
      sessionStorage.setItem("fineQuery", JSON.stringify(payload));
      
      // Simulate API call
      setTimeout(() => {
        setLocation("/payment");
      }, 500);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const plateTypes = [
    { value: "private", label: "خصوصي" },
    { value: "taxi", label: "تاكسي" },
    { value: "bus", label: "حافلة" },
    { value: "truck", label: "شاحنة" },
    { value: "motorcycle", label: "دراجة نارية" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">الاستعلام عن المخالفات المرورية</h1>
          <p className="text-gray-600 text-sm">وزارة الداخلية - دولة قطر</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => handleTabChange("establishment")}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              query.queryType === "establishment"
                ? "bg-white border-2 border-blue-500 shadow-lg"
                : "bg-white border-2 border-gray-200 shadow-sm"
            }`}
          >
            <Building2 size={32} className={query.queryType === "establishment" ? "text-blue-600" : "text-gray-400"} />
            <span className={`text-xs font-bold ${query.queryType === "establishment" ? "text-blue-600" : "text-gray-600"}`}>
              قيد المنشأة
            </span>
          </button>

          <button
            onClick={() => handleTabChange("personal")}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              query.queryType === "personal"
                ? "bg-white border-2 border-blue-500 shadow-lg"
                : "bg-white border-2 border-gray-200 shadow-sm"
            }`}
          >
            <User size={32} className={query.queryType === "personal" ? "text-blue-600" : "text-gray-400"} />
            <span className={`text-xs font-bold ${query.queryType === "personal" ? "text-blue-600" : "text-gray-600"}`}>
              الرقم الشخصي
            </span>
          </button>

          <button
            onClick={() => handleTabChange("vehicle")}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              query.queryType === "vehicle"
                ? "bg-white border-2 border-blue-500 shadow-lg"
                : "bg-white border-2 border-gray-200 shadow-sm"
            }`}
          >
            <Car size={32} className={query.queryType === "vehicle" ? "text-blue-600" : "text-gray-400"} />
            <span className={`text-xs font-bold ${query.queryType === "vehicle" ? "text-blue-600" : "text-gray-600"}`}>
              رقم المركبة
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Title for current query type */}
          <h2 className="text-xl font-bold text-blue-900 text-center">
            {query.queryType === "establishment" && "الاستعلام بقيد المنشأة"}
            {query.queryType === "personal" && "الاستعلام بالرقم الشخصي"}
            {query.queryType === "vehicle" && "الاستعلام برقم المركبة"}
          </h2>

          {/* Establishment Query */}
          {query.queryType === "establishment" && (
            <div className="space-y-4">
              <div>
                <label className="block text-right text-sm font-bold text-gray-700 mb-2">
                  قيد المنشأة
                </label>
                <input
                  type="text"
                  value={query.establishmentId}
                  onChange={(e) => handleInputChange("establishmentId", e.target.value)}
                  placeholder="أدخل قيد المنشأة"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right"
                />
              </div>
            </div>
          )}

          {/* Personal ID Query */}
          {query.queryType === "personal" && (
            <div className="space-y-4">
              <div>
                <label className="block text-right text-sm font-bold text-gray-700 mb-2">
                  الرقم الشخصي
                </label>
                <input
                  type="text"
                  value={query.personalId}
                  onChange={(e) => handleInputChange("personalId", e.target.value)}
                  placeholder="أدخل الرقم الشخصي"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right"
                />
              </div>

              {/* Captcha for personal query */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex gap-2 items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 hover:bg-gray-200 rounded-lg transition">
                      <Volume2 size={20} className="text-gray-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded-lg transition">
                      <RotateCcw size={20} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="bg-gray-300 h-12 w-32 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                    6880C
                  </div>
                </div>
                <input
                  type="text"
                  value={query.captchaCode}
                  onChange={(e) => handleInputChange("captchaCode", e.target.value)}
                  placeholder="أدخل رمز التحقق"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-right text-sm"
                />
              </div>
            </div>
          )}

          {/* Vehicle Query */}
          {query.queryType === "vehicle" && (
            <div className="space-y-4">
              {/* Country */}
              <div>
                <label className="block text-right text-sm font-bold text-gray-700 mb-2">
                  البلد
                </label>
                <select
                  value={query.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right appearance-none bg-white"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "left 1rem center", paddingLeft: "2.5rem" }}
                >
                  <option value="qatar">قطر</option>
                </select>
              </div>

              {/* Plate Type */}
              <div>
                <label className="block text-right text-sm font-bold text-gray-700 mb-2">
                  نوع اللوحة
                </label>
                <select
                  value={query.plateType}
                  onChange={(e) => handleInputChange("plateType", e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right appearance-none bg-white"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "left 1rem center", paddingLeft: "2.5rem" }}
                >
                  {plateTypes.map(pt => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
              </div>

              {/* Plate Number */}
              <div>
                <label className="block text-right text-sm font-bold text-gray-700 mb-2">
                  رقم اللوحة
                </label>
                <input
                  type="text"
                  value={query.plateNumber}
                  onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                  placeholder="أدخل رقم المركبة"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right"
                />
              </div>

              {/* Owner Data Section */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-right text-sm font-bold text-gray-700 mb-4">بيانات المالك</p>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerType"
                      checked={query.vehicleOwnerIdType === "personal"}
                      onChange={() => handleInputChange("vehicleOwnerIdType", "personal")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold text-gray-700">رقم شخصي</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerType"
                      checked={query.vehicleOwnerIdType === "establishment"}
                      onChange={() => handleInputChange("vehicleOwnerIdType", "establishment")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold text-gray-700">قيد منشأة</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={query.vehicleOwnerId}
                  onChange={(e) => handleInputChange("vehicleOwnerId", e.target.value)}
                  placeholder={query.vehicleOwnerIdType === "personal" ? "أدخل الرقم الشخصي" : "أدخل قيد المنشأة"}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-right text-sm"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "جاري البحث..." : "استعلم"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold py-4 rounded-xl transition-all"
            >
              مسح
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>fees2.moi.gov.qa</p>
        </div>
      </div>
    </div>
  );
}
