"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "granted");
    setShowBanner(false);
    // Trigger a custom event so Analytics component can re-render/inject scripts
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  const rejectAll = () => {
    localStorage.setItem("cookie-consent", "denied");
    setShowBanner(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-3 bg-[#064E3B]/10 text-[#064E3B] rounded-full shrink-0 hidden md:block">
            <Cookie size={28} />
          </div>
          <div>
            <h3 className="font-bold text-[#181A2C] text-lg mb-1 flex items-center gap-2">
              <Cookie size={20} className="md:hidden text-[#064E3B]" />
              Sütiket (cookie) használunk
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-4xl">
              Weboldalunk az alapvető működéshez szükséges (esszenciális) sütiket, valamint a látogatói élmény javítása és a személyre szabott ajánlatok (marketing) érdekében analitikai és hirdetési sütiket használ. 
              Az "Elfogadom" gombra kattintva Ön hozzájárul az összes süti használatához. A beállításokat bármikor módosíthatja böngészőjében. Részletes információkért olvassa el az <Link href="/adatvedelem" className="text-[#059669] hover:underline font-medium">Adatvédelmi Nyilatkozatunkat</Link>.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={rejectAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} /> Csak a szükségesek
          </button>
          <button 
            onClick={acceptAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#064E3B] text-white font-bold hover:bg-[#059669] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Check size={18} /> Összes elfogadása
          </button>
        </div>
      </div>
    </div>
  );
}
