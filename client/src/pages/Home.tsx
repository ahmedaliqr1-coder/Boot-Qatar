import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar,
  Hash,
  Building2,
  Info,
  Ticket,
  ArrowLeft,
  ArrowRight,
  Search,
  User,
  Home as HomeIcon,
  CreditCard,
  X,
  Shield,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/useMobile";

// ===== ASSETS =====
const MOI_QATAR_LOGO = "https://portal.moi.gov.qa/wps/PA_MOIPortalStaticResources/images/moi-logo-ar.png";
const QATAR_FLAG_ICON = "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg";

// ===== PLATE SOURCES =====
const ALL_PLATE_SOURCES = [
  { value: "QAT", label: "دولة قطر", labelEn: "Qatar" },
  { value: "KSA", label: "السعودية", labelEn: "Saudi Arabia" },
  { value: "KWT", label: "الكويت", labelEn: "Kuwait" },
  { value: "UAE", label: "الإمارات", labelEn: "UAE" },
  { value: "OMN", label: "عمان", labelEn: "Oman" },
  { value: "BAH", label: "البحرين", labelEn: "Bahrain" },
];

// ===== QATAR PLATE TYPES =====
const QATAR_PLATE_TYPES = [
  { value: "1", label: "خصوصي", labelEn: "Private" },
  { value: "2", label: "نقل خاص", labelEn: "Private Transport" },
  { value: "3", label: "دراجة نارية", labelEn: "Motorcycle" },
  { value: "4", label: "نقل عام", labelEn: "Public Transport" },
  { value: "5", label: "تصدير", labelEn: "Export" },
  { value: "6", label: "مقطورة", labelEn: "Trailer" },
];

type SearchTab = "plate" | "licence" | "tcnumber" | "ticket";
type ViewMode = "form" | "results";

interface FineResult {
  ticketNo: string;
  amount: string;
  location: string;
  source: string;
  description: string;
  dateTime: string;
  status: string;
  isPaid: boolean;
}

interface QueryResult {
  success: boolean;
  fines: FineResult[];
  errorMessage?: string;
  queryId?: number;
  sessionId?: string | null;
}

// ===== QATAR PLATE DISPLAY COMPONENT =====
function QatarPlateDisplay({ plateNumber, plateType }: { plateNumber: string; plateType: string }) {
  const typeLabel = QATAR_PLATE_TYPES.find(t => t.value === plateType)?.label || "خصوصي";
  
  return (
    <div className="flex flex-col items-center justify-center bg-white border-4 border-gray-300 rounded-lg p-2 min-w-[200px] shadow-md">
      <div className="w-full flex justify-between items-center border-b border-gray-200 pb-1 mb-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase">Qatar</span>
        <span className="text-[10px] font-bold text-gray-500">قطر</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black text-gray-900 tracking-widest">{plateNumber || "000000"}</span>
      </div>
      <div className="text-[10px] font-bold text-maroon-700 mt-1">{typeLabel}</div>
    </div>
  );
}

function InquiryForm({
  searchTab,
  plateSource, setPlateSource,
  plateNumber, setPlateNumber,
  plateCode, setPlateCode,
  ownerId, setOwnerId,
  ownerIdType, setOwnerIdType,
  onEnter,
}: {
  searchTab: SearchTab;
  plateSource: string; setPlateSource: (v: string) => void;
  plateNumber: string; setPlateNumber: (v: string) => void;
  plateCode: string; setPlateCode: (v: string) => void;
  ownerId: string; setOwnerId: (v: string) => void;
  ownerIdType: 'personal' | 'establishment'; setOwnerIdType: (v: 'personal' | 'establishment') => void;
  onEnter: () => void;
}) {
  const { t, lang } = useLanguage();
  
  const fieldLabelClass = "text-sm font-bold text-gray-700 block text-right mb-2";
  const selectBaseClass = "w-full text-base rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-maroon-600 focus:outline-none transition-all bg-white";
  const inputBaseClass = "w-full text-base rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-maroon-600 focus:outline-none transition-all bg-gray-50";

  if (searchTab === "plate") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={fieldLabelClass}>{t.home.form.plateSource}</label>
            <select
              value={plateSource}
              onChange={(e) => setPlateSource(e.target.value)}
              className={selectBaseClass}
            >
              {ALL_PLATE_SOURCES.map((s) => (<option key={s.value} value={s.value}>{lang === "en" ? s.labelEn : s.label}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>{t.home.form.plateCode}</label>
            <select
              value={plateCode}
              onChange={(e) => setPlateCode(e.target.value)}
              className={selectBaseClass}
            >
              <option value="" disabled>{t.home.form.plateCodePlaceholder}</option>
              {QATAR_PLATE_TYPES.map((t) => (<option key={t.value} value={t.value}>{lang === "en" ? t.labelEn : t.label}</option>))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className={fieldLabelClass}>{t.home.form.plateNumber}</label>
          <input 
            type="text" 
            value={plateNumber} 
            onChange={(e) => setPlateNumber(e.target.value)} 
            placeholder={t.home.form.plateNumberPlaceholder} 
            onKeyDown={(e) => e.key === "Enter" && onEnter()} 
            className={inputBaseClass}
            dir="ltr"
          />
        </div>

        <div className="space-y-4 p-4 bg-maroon-50 rounded-2xl border border-maroon-100">
          <label className={fieldLabelClass}>{t.home.form.ownerIdType}</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setOwnerIdType('personal')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${ownerIdType === 'personal' ? 'bg-maroon-700 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {t.home.form.personal}
            </button>
            <button 
              onClick={() => setOwnerIdType('establishment')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${ownerIdType === 'establishment' ? 'bg-maroon-700 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {t.home.form.establishment}
            </button>
          </div>
          <div className="space-y-2 mt-2">
            <input 
              type="text" 
              value={ownerId} 
              onChange={(e) => setOwnerId(e.target.value)} 
              placeholder={t.home.form.ownerIdPlaceholder} 
              onKeyDown={(e) => e.key === "Enter" && onEnter()} 
              className={inputBaseClass}
              dir="ltr"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 italic">
      <Shield className="w-16 h-16 mb-4 opacity-20" />
      <p>{lang === 'ar' ? 'هذه الخدمة ستتوفر قريباً' : 'This service will be available soon'}</p>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("form");
  const [searchTab, setSearchTab] = useState<SearchTab>("plate");
  const [plateSource, setPlateSource] = useState("QAT");
  const [plateNumber, setPlateNumber] = useState("");
  const [plateCode, setPlateCode] = useState("1");
  const [ownerId, setOwnerId] = useState("");
  const [ownerIdType, setOwnerIdType] = useState<'personal' | 'establishment'>('personal');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [selectedFines, setSelectedFines] = useState<Set<number>>(new Set());
  
  const { t, lang, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  const queryMutation = trpc.fines.query.useMutation({
    onSuccess: (data) => {
      setResult(data as QueryResult);
      setView("results");
      setSelectedFines(new Set());
    },
    onError: (err) => {
      toast.error((lang === "ar" ? "فشل الاستعلام: " : "Query failed: ") + err.message);
    },
  });

  const handleQuery = () => {
    if (!plateNumber) {
      toast.error(lang === "ar" ? "يرجى إدخال رقم اللوحة" : "Please enter plate number");
      return;
    }
    if (!ownerId) {
      toast.error(lang === "ar" ? "يرجى إدخال الرقم الشخصي" : "Please enter ID number");
      return;
    }

    queryMutation.mutate({
      plateSource,
      plateNumber,
      plateCode,
      ownerId,
      ownerIdType,
      lang,
    });
  };

  const selectedTotal = Array.from(selectedFines).reduce((sum, idx) => {
    const fine = result?.fines[idx];
    if (!fine) return sum;
    return sum + parseFloat(fine.amount.replace(/[^0-9.]/g, ""));
  }, 0);

  const goToPayment = () => {
    if (selectedFines.size === 0) {
      toast.error(lang === 'ar' ? 'يرجى تحديد مخالفة واحدة على الأقل' : 'Please select at least one fine');
      return;
    }

    const selectedFinesData = Array.from(selectedFines).map(idx => result?.fines[idx]);
    const payload = {
      selectedFines: selectedFinesData,
      totalAmount: selectedTotal.toFixed(2),
      plateNumber,
      plateSource,
      queryId: result?.queryId,
      sessionId: result?.sessionId,
    };

    sessionStorage.setItem("paymentData", JSON.stringify(payload));
    navigate(isRTL ? "/ar/payment" : "/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={MOI_QATAR_LOGO} alt="MOI Qatar" className="h-12 object-contain" />
            {!isMobile && (
              <div className="flex flex-col border-r pr-4 mr-4 border-gray-200">
                <span className="font-bold text-maroon-900 text-lg leading-tight">{t.header.siteName}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Traffic Department</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-maroon-50 text-maroon-800 border-maroon-200 px-3 py-1">
              {lang === 'ar' ? 'الخدمات الإلكترونية' : 'E-Services'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === "form" ? (
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-maroon-800 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-700 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
              <h1 className="text-3xl font-black mb-2 relative z-10">{t.home.title}</h1>
              <p className="text-maroon-100 opacity-90 relative z-10">{t.home.subtitle}</p>
            </div>

            <div className="p-8">
              {/* Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                {(["plate", "licence", "tcnumber", "ticket"] as SearchTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSearchTab(tab)}
                    className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      searchTab === tab ? "bg-white text-maroon-800 shadow-md" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === 'plate' && <Hash size={16} />}
                    {tab === 'licence' && <User size={16} />}
                    {tab === 'tcnumber' && <Building2 size={16} />}
                    {tab === 'ticket' && <Ticket size={16} />}
                    {t.home.tabs[tab]}
                  </button>
                ))}
              </div>

              <InquiryForm
                searchTab={searchTab}
                plateSource={plateSource} setPlateSource={setPlateSource}
                plateNumber={plateNumber} setPlateNumber={setPlateNumber}
                plateCode={plateCode} setPlateCode={setPlateCode}
                ownerId={ownerId} setOwnerId={setOwnerId}
                ownerIdType={ownerIdType} setOwnerIdType={setOwnerIdType}
                onEnter={handleQuery}
              />

              <button
                onClick={handleQuery}
                disabled={queryMutation.isPending}
                className="w-full mt-8 bg-maroon-700 hover:bg-maroon-800 text-white font-black py-5 rounded-2xl shadow-lg shadow-maroon-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {queryMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>{t.home.form.checkButton}</span>
                    <ArrowLeft className={`transition-transform group-hover:-translate-x-1 ${isRTL ? '' : 'rotate-180 group-hover:translate-x-1'}`} />
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-800 text-xs leading-relaxed border border-blue-100">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>{t.home.form.infoNote}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => setView("form")}
                className="flex items-center gap-2 text-gray-500 hover:text-maroon-700 font-bold transition-colors"
              >
                <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} />
                <span>{t.home.results.backButton}</span>
              </button>
              <h2 className="text-2xl font-black text-gray-900">{t.home.results.title}</h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <QatarPlateDisplay plateNumber={plateNumber} plateType={plateCode} />
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'بيانات الاستعلام' : 'Inquiry Info'}</div>
                  <div className="text-sm font-bold text-gray-700">{t.home.form.ownerId}: <span className="text-maroon-700">{ownerId}</span></div>
                  <div className="text-xs text-gray-500">{ownerIdType === 'personal' ? t.home.form.personal : t.home.form.establishment}</div>
                </div>
              </div>
              <div className="bg-maroon-50 px-8 py-4 rounded-2xl border border-maroon-100 text-center min-w-[180px]">
                <div className="text-xs text-maroon-600 font-bold mb-1">{t.home.results.totalAmount}</div>
                <div className="text-3xl font-black text-maroon-900">{result?.fines.length === 0 ? "0.00" : selectedTotal.toFixed(2)} <span className="text-sm font-bold">{t.home.results.currency}</span></div>
              </div>
            </div>

            {result?.fines.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 shadow-lg border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{t.home.results.noFines}</h3>
                <p className="text-gray-500">{t.home.results.noFinesDesc}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {result?.fines.map((fine, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      const newSelected = new Set(selectedFines);
                      if (newSelected.has(idx)) newSelected.delete(idx);
                      else newSelected.add(idx);
                      setSelectedFines(newSelected);
                    }}
                    className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      selectedFines.has(idx) ? 'border-maroon-500 bg-maroon-50/30' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedFines.has(idx) ? 'bg-maroon-600 border-maroon-600 text-white' : 'border-gray-300'
                    }`}>
                      {selectedFines.has(idx) && <CheckCircle2 size={14} />}
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{t.home.results.fineCard.fineNumber}</div>
                        <div className="text-sm font-bold text-gray-800">{fine.ticketNo}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{t.home.results.fineCard.date}</div>
                        <div className="text-sm font-bold text-gray-800">{fine.dateTime}</div>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{t.home.results.fineCard.location}</div>
                        <div className="text-sm font-bold text-gray-800 truncate">{fine.location}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{t.home.results.fineCard.amount}</div>
                        <div className="text-lg font-black text-maroon-700">{fine.amount} {t.home.results.currency}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="sticky bottom-6 left-0 right-0 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="hidden md:block">
                    <div className="text-xs text-gray-500 font-bold">{lang === 'ar' ? 'المخالفات المحددة' : 'Selected Fines'}</div>
                    <div className="text-sm font-black text-gray-800">{selectedFines.size} {lang === 'ar' ? 'مخالفة' : 'Fine(s)'}</div>
                  </div>
                  <button
                    onClick={goToPayment}
                    className="flex-1 md:flex-none md:min-w-[300px] bg-maroon-700 hover:bg-maroon-800 text-white font-black py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>{t.home.results.paySelected} ({selectedTotal.toFixed(2)} {t.home.results.currency})</span>
                    <CreditCard size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src={MOI_QATAR_LOGO} alt="MOI Qatar" className="h-16 mx-auto mb-6 opacity-50 grayscale" />
          <p className="text-gray-400 text-sm font-medium mb-2">© {new Date().getFullYear()} {t.header.siteName}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
          <div className="flex items-center justify-center gap-6 text-gray-400 text-xs">
            <a href="#" className="hover:text-maroon-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-maroon-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-maroon-700 transition-colors">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
