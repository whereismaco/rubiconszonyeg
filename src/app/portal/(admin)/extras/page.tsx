import { Zap, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import CountdownTimer from '@/components/admin/CountdownTimer';

export default function ExtrasPage() {
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
          {extras.map((extra, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl border transition-all ${extra.active ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-[#059669]/50'}`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  {extra.active ? (
                    <CheckCircle2 className="text-green-500" size={24} />
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
                    <a href={extra.demoLink} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#059669] hover:text-[#064E3B] transition-colors">
                      Demo megtekintése <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Megtetszett valamelyik funkció?</p>
          <a 
            href="mailto:whereismaco@gmail.com?subject=Rubicon%20-%20Extra%20Funkci%C3%B3%20%C3%89rdekl%C5%91d%C3%A9s" 
            className="inline-flex bg-[#181A2C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#064E3B] transition-colors shadow-lg"
          >
            Érdeklődöm a fejlesztésről
          </a>
        </div>
      </div>
    </div>
  );
}
