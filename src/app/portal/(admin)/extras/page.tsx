"use client";

import { useState } from 'react';
import { Zap, CheckCircle2, Circle, ArrowRight, CheckSquare } from 'lucide-react';
import CountdownTimer from '@/components/admin/CountdownTimer';
import { sendExtrasEmail } from '@/lib/actions';

export default function ExtrasPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const extras = [
    {
      title: "Új logó és arculat tervezése",
      price: "50 000 Ft",
      desc: "3 tervezet. Vektor formátum, bármekkora méretre nagyítható névjegytől óriásplakátig minőségromlás nélkül.",
      active: false
    },
    {
      title: "Facebook profil és fejléckép + 5 bejegyzés",
      price: "25 000 Ft",
      desc: "Közösségi média jelenlét elindítása profi grafikákkal és bejegyzésekkel (csak arculattervezéssel együtt választható).",
      active: false
    },
    {
      title: "Árkalkulátor fejlesztése",
      price: "70 000 Ft",
      desc: "A látogatónak lehetősége lesz előre kiszámolni az árat, külön szőnyegeket hozzáadni méretekkel. A rendszer a te áraiddal kalkulál.",
      active: false,
      demoLink: "/portal/demo-quote"
    },
    {
      title: "Továbbfejlesztett ügyfélkezelői rendszer",
      price: "50 000 Ft",
      desc: "Az admin felületről módosítod a munkafolyamat állapotát, automatikusan értesítjük az ügyfelet email-ben akár csatolt fotókkal.",
      active: false
    },
    {
      title: "Beépített AI Chatbot",
      price: "100 000 Ft",
      desc: "Sales ügynök a weboldalon, aki éjjel-nappal válaszol a látogatóknak. (+ használat alapú díj, induláskor 10e Ft kredittel ami hónapokig elég).",
      active: false
    },
    {
      title: "Whatsapp és Messenger üzenetküldő gombok",
      price: "10 000 Ft",
      desc: "A látogatót azonnali üzenetküldésre ösztönözzük egy lebegő gombbal a weboldal sarkában.",
      active: false
    },
    {
      title: "Saját belső AI ügynök",
      price: "50 000 Ft",
      desc: "Saját, betanított marketing és tanácsadó chatbot a Google rendszerében. Segít posztokat írni, ügyfelekkel kommunikálni.",
      active: false
    },
    {
      title: "Automata véleménykérő rendszer",
      price: "20 000 Ft",
      desc: "24 órával a kiszállítottnak jelölés után a rendszer küld egy emailt a vevőnek, amiben megkérjük, hogy írjon véleményt.",
      active: false
    },
    {
      title: "Teljes SEO + AIO optimalizálás",
      price: "40 000 Ft",
      desc: "Google Search Console, Tag Manager és Analytics bekötése. AIO: AI keresőoptimalizálás (hogy az AI is téged ajánljon).",
      active: false,
      demoLink: "/portal/statistics"
    },
    {
      title: "Hirdetésre való felkészítés",
      price: "50 000 Ft",
      desc: "Összekötés Meta képponttal (Facebook/Instagram) és Google Ads-el remarketinghez és célzott hirdetésekhez.",
      active: true
    },
    {
      title: "Környékbeli dominancia",
      price: "25 000 Ft",
      desc: "5 db külön aloldal készítése a környékbeli városokra (pl. Tárnok, Diósd) a helyi keresések megnyeréséért.",
      active: false
    },
    {
      title: "Blog rendszer + 3 poszt",
      price: "60 000 Ft",
      desc: "Blog rendszer kiépítése és 3 SEO-optimalizált cikk (pl. 'Hogyan tisztítsuk ki a kávéfoltot').",
      active: false
    },
    {
      title: "GDPR és Jogi megfeleltetés",
      price: "40 000 Ft",
      desc: "Teljes körű, személyre szabott ÁSZF és Adatvédelmi Nyilatkozat elkészítése és integrációja a weboldalba, Cookie banner beállítása a magyar jogszabályoknak megfelelően.",
      active: true
    },
    {
      title: "Ügyfél visszaszerző rendszer",
      price: "30 000 Ft",
      desc: "Ha egy ügyfél szőnyegét 6-12 hónapja tisztítottuk, automatikusan küldünk neki emailt kedvezménnyel az újabb tisztításra.",
      active: false
    },
    {
      title: "Online fizetés",
      price: "40 000 - 80 000 Ft",
      desc: "Bankkártyás fizetési rendszer integrációja (Revolut, Wise, Stripe vagy PayPal).",
      active: false
    },
    {
      title: "Számlázz.hu összekötés",
      price: "40 000 Ft",
      desc: "Automatikus számlakiállítás az admin felületből Számlázz.hu API-n keresztül.",
      active: false
    }
  ];

  const toggleSelection = (title: string) => {
    setSelected(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleSend = async () => {
    setIsSending(true);
    const result = await sendExtrasEmail(selected);
    if (result.success) {
      setIsSuccess(true);
    } else {
      alert("Hiba történt az email küldésekor.");
    }
    setIsSending(false);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-green-50 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 border border-green-100 shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckSquare size={40} />
          </div>
          <h3 className="text-3xl font-black text-[#181A2C] mb-4">Sikeres küldés!</h3>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Köszönöm az érdeklődést! Megkaptam az üzenetet a kiválasztott extrákról, és hamarosan felveszem veled a kapcsolatot a részletekkel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#FEC500]/20 text-[#FEC500] rounded-xl">
          <Zap size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#181A2C]">Extra Funkciók</h1>
          <p className="text-gray-500 mt-1">Fejleszd tovább a rendszeredet, ha a vállalkozásod növekszik!</p>
        </div>
      </div>

      <CountdownTimer targetDate="2026-05-31T23:59:59" />

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <p className="text-gray-600 mb-8 leading-relaxed">
          Az alapcsomag (200.000 Ft) már tartalmazza a teljes weboldalt és az admin felületet. 
          De ha szeretnéd automatizálni a folyamataidat, vagy több ügyfelet szerezni, 
          az alábbi "okos" modulokat bármikor hozzáadhatjuk a rendszeredhez:
        </p>

        <div className="space-y-4">
          {extras.map((extra, idx) => {
            const isSelected = selected.includes(extra.title);
            
            return (
              <div 
                key={idx} 
                onClick={() => !extra.active && toggleSelection(extra.title)}
                className={`p-5 rounded-2xl border transition-all ${extra.active ? 'bg-green-50/50 border-green-200' : isSelected ? 'bg-[#059669]/10 border-[#059669] cursor-pointer' : 'bg-gray-50 border-gray-200 hover:border-[#059669]/50 cursor-pointer'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    {extra.active ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : isSelected ? (
                      <CheckCircle2 className="text-[#059669]" size={24} />
                    ) : (
                      <Circle className="text-gray-300" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                      <h3 className={`font-bold text-lg ${extra.active ? 'text-green-800' : 'text-[#181A2C]'}`}>
                        {extra.title}
                      </h3>
                      <div className="shrink-0 font-mono font-bold text-[#064E3B] bg-white px-3 py-1 rounded-lg border border-gray-100">
                        {extra.price}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{extra.desc}</p>
                    
                    {extra.active && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-md">
                        Aktiválva a jelenlegi csomagban
                      </div>
                    )}

                    {!extra.active && extra.demoLink && (
                      <a href={extra.demoLink} onClick={(e) => e.stopPropagation()} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#059669] hover:text-[#064E3B] transition-colors relative z-10">
                        Demo megtekintése <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">
            {selected.length > 0 
              ? `${selected.length} funkciót jelöltél ki érdeklődésre.` 
              : `Megtetszett valamelyik funkció? Kattints rá a kijelöléshez!`}
          </p>
          <button 
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center justify-center gap-2 bg-[#181A2C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#064E3B] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSending ? 'Küldés folyamatban...' : (selected.length > 0 ? 'Kiválasztott extrák igénylése' : 'Érdeklődöm a fejlesztésről')}
          </button>
        </div>
      </div>
    </div>
  );
}
