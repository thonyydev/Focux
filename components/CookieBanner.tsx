"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay to avoid layout shift/bad UX on load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (consent === "granted") {
      setConsentGranted(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "granted");
    setConsentGranted(true);
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "denied");
    setConsentGranted(false);
    setIsVisible(false);
  };

  return (
    <>
      {consentGranted && (
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
        />
      )}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl"
          >
            <div className="relative flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/80 px-6 py-4 shadow-2xl backdrop-blur-xl md:flex-row">
              <div className="text-sm text-gray-300">
                <strong className="block font-semibold text-white">
                  Respeitamos sua privacidade
                </strong>
                <p className="mt-1 leading-relaxed">
                  Utilizamos cookies e o Google Analytics para entender como
                  você usa o <strong>Focux</strong> e melhorar sua experiência.
                  Todos os dados são anonimizados conforme a LGPD.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={declineCookies}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 decoration-2 hover:text-white hover:underline"
                >
                  Recusar
                </button>
                <button
                  onClick={acceptCookies}
                  className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Aceitar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
