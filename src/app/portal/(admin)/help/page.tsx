import { HelpCircle, Settings, Calculator, LayoutDashboard, Star, Lock, Info } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#064E3B]/10 text-[#064E3B] rounded-xl">
          <HelpCircle size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#181A2C]">Súgóközpont</h1>
          <p className="text-gray-500 mt-1">Gyakran ismételt kérdések és útmutató a portál használatához</p>
        </div>
      </div>

      {/* Videós Útmutató */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="aspect-video w-full bg-gray-100">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/y1dER9ksVh8" 
            title="Rubicon Admin Portál Bemutató" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Általános áttekintés */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-6">
          <LayoutDashboard className="text-[#059669]" /> 1. Irányítópult (Munkák kezelése)
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Az <strong>Irányítópult</strong> az admin felületed "szíve". Ide fut be minden olyan ajánlatkérés, 
            amit az ügyfelek a weboldaladon lévő űrlapon keresztül küldenek el.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Státusz módosítása:</strong> A táblázat "Státusz" oszlopában bármikor átállíthatod egy munka állapotát (pl. <em>Felvételre vár</em>, <em>Tisztítás alatt</em>, <em>Elkészült</em>).</li>
            <li><strong>Szerkesztés:</strong> Ha egy ügyfél felhív, hogy mégsem 2, hanem 3 szőnyeget adna le, kattints a "Szerkesztés" gombra a táblázat szélén, és add hozzá az új tételt, vagy írd át az árat.</li>
            <li><strong>Útvonaltervezés:</strong> A cím mellett lévő kék térkép ikonra kattintva azonnal megnyílik a Google Térkép a telefonodon/gépeden a megadott címmel.</li>
          </ul>
        </div>
      </div>

      {/* Munkafelvétel */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-6">
          <Calculator className="text-[#059669]" /> 2. Kézi Munkafelvétel (Telefonos megrendelések)
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Ha egy ügyfél nem a weboldalon, hanem <strong>telefonon vagy SMS-ben</strong> rendel tőled, 
            itt tudod felvinni a rendszerbe, hogy később az Irányítópulton tudd követni.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Válaszd ki a kategóriát: Szőnyeg, Kárpit vagy Autó.</li>
            <li>Pötyögd be az adatokat (méretek, extrák).</li>
            <li><strong>Fontos:</strong> A "Kézi Ár megadása" mezőbe neked kell beírnod, hogy mennyit kérsz azért a tételért.</li>
            <li>Nyomj a "Szőnyeg/Kárpit/Autó hozzáadása" gombra.</li>
            <li>Végül töltsd ki lent az ügyfél nevét, címét, és mentsd el a munkát!</li>
          </ol>
        </div>
      </div>

      {/* Beállítások és Árazás */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-6">
          <Settings className="text-[#059669]" /> 3. Beállítások és Weboldal módosítása
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>A Beállítások menüpontban három fő dolgot tudsz módosítani anélkül, hogy programozóhoz kellene fordulnod:</p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
            <h3 className="font-bold text-[#064E3B] mb-2">A) Weboldal Szövegei (Tartalom)</h3>
            <p className="text-sm">Itt tudod átírni a cég nevét, a telefonszámodat, vagy épp a főoldalon lévő bemutatkozó szövegeket.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-[#064E3B] mb-2">B) Árlista (Szolgáltatások)</h3>
            <p className="text-sm mb-2">Itt adhatod meg a szőnyeg vastagságokat, kárpit típusokat és az árakat. <strong>Kérlek, nagyon figyelj az alábbiakra:</strong></p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Amikor átírod az árakat, mindig <strong>csak számokat</strong> írj be! (Pl. helyes: <code>1500</code>. Helytelen: <code>1500 Ft</code>).</li>
              <li>A szőnyegeknél négyzetméter (m2) árakat kell megadni, nem darabárat.</li>
              <li>A kiszállási díj limitet is itt állíthatod be (pl. "Ingyenes 15.000 Ft felett").</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-[#064E3B] mb-2">C) Biztonság (Ki léphet be ide?)</h3>
            <p className="text-sm">Az admin felület extrém biztonságos. Ide <strong>csak az léphet be, akinek az email címe fel van véve a listára</strong>! Ha hozzá akarsz adni egy munkatársat, csak írd be az ő Google (Gmail) címét is a "Biztonság" fül alatt.</p>
          </div>
        </div>
      </div>

      {/* Vélemények */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-6">
          <Star className="text-[#059669]" /> 4. Értékelések Kezelése
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Az Értékelések menüpontban láthatod a weboldaladra beérkezett Google véleményeket.
            Ezeket a rendszer automatikusan frissíti a Google Maps profilodból, így a weboldaladon 
            mindig a legújabb, legrelevánsabb, hiteles 5 csillagos vélemények fognak megjelenni a potenciális ügyfeleknek!
          </p>
        </div>
      </div>

      {/* Upsell / Prémium */}
      <div className="bg-gradient-to-r from-[#181A2C] to-[#064E3B] rounded-3xl p-8 shadow-lg border border-gray-100 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#FEC500]">
          <Lock size={20} /> Mi az a "Prémium DEMO" a menüben?
        </h2>
        <div className="space-y-4 text-gray-200 leading-relaxed text-sm">
          <p>
            A weboldaladat úgy fejlesztettem le, hogy később könnyen tovább lehessen fejleszteni egy komplett 
            vállalatirányítási rendszerré. A DEMO menüpontok alatt olyan <strong>prémium funkciókat</strong> mutatunk be, amiket 
            bármikor aktiválhatsz a jövőben, ha a vállalkozásod növekszik:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Intelligens Kalkulátor:</strong> A gép a beállításokban megadott árak, kategóriák és méretek alapján tizedmilliméter pontossággal kiszámolja helyetted az árat és felszorozza az extrákkal. Ezt a látogatóid is használhatják a főoldalon, ha megvásárolod a modult!</li>
            <li><strong>Statisztika (SEO+AIO):</strong> Pontosan láthatod a Google Analitika grafikonjain, hogy hányan voltak az oldalon, és melyik Google Keresésből jöttek.</li>
          </ul>
          <div className="pt-4 flex items-start gap-3 bg-white/10 p-4 rounded-xl">
            <Info size={24} className="text-[#FEC500] shrink-0 mt-0.5" />
            <p>
              Ha úgy érzed, hogy ezek a funkciók sok időt és pénzt spórolnának meg neked a mindennapokban,
              keress meg bátran a bekapcsolásukkal kapcsolatban!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
