import { BarChart3, Info, ExternalLink } from "lucide-react";

export default function StatisticsPage() {
  const lookerStudioUrl = process.env.NEXT_PUBLIC_LOOKER_STUDIO_EMBED_URL;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="text-[#3AC2FE]" size={32} />
        <h1 className="text-3xl font-black text-[#181A2C]">Weboldal Statisztika</h1>
      </div>

      {lookerStudioUrl ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full h-[800px]">
          <iframe 
            src={lookerStudioUrl} 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen 
            sandbox="allow-storage allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="w-full h-full"
          ></iframe>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-[#1D63B7] rounded-xl shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#181A2C] mb-2">A statisztikai modul jelenleg nincs bekötve</h2>
              <p className="text-gray-600 leading-relaxed">
                Ez a funkció lehetővé teszi, hogy valós időben lásd a weboldalad forgalmát, a látogatók számát, hogy honnan érkeztek (Facebook, Google kereső, közvetlen link), mennyi időt töltöttek az oldalon, és hogy hányan kértek árajánlatot.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-[#181A2C] mb-4">Fejlesztői instrukciók az aktiváláshoz:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
              <li>Lépj be a <a href="https://lookerstudio.google.com/" target="_blank" rel="noreferrer" className="text-[#1D63B7] hover:underline inline-flex items-center gap-1">Google Looker Studio <ExternalLink size={12} /></a> felületére azzal a Google fiókkal, amivel az Analytics-et (GA4) létrehoztad.</li>
              <li>Hozz létre egy új <b>Üres jelentést</b> (Blank Report) vagy válassz egy Google Analytics sablont.</li>
              <li>Adatforrásként (Data Source) válaszd ki a <b>Google Analytics</b> opciót, majd a nemrég létrehozott fiókodat (G-LRWGYX4Y54).</li>
              <li>A Looker Studio jobb felső sarkában kattints a <b>Megosztás (Share)</b> gomb melletti kis nyílra, és válaszd a <b>Jelentés beágyazása (Embed report)</b> opciót.</li>
              <li>Engedélyezd a beágyazást, majd a kapott kódból (iframe) másold ki az <b>URL-t</b> (a <code className="bg-gray-200 px-1 py-0.5 rounded text-red-600">src="..."</code> idézőjelek közötti részét).</li>
              <li>Illeszd be ezt a linket a weboldalad szerverén / kódbázisában a <code className="bg-white border px-1.5 py-0.5 rounded font-mono text-[#1D63B7]">.env.local</code> fájlba, a <code className="bg-white border px-1.5 py-0.5 rounded font-mono text-[#1D63B7]">NEXT_PUBLIC_LOOKER_STUDIO_EMBED_URL</code> változó értékeként.</li>
              <li>Indítsd újra a rendszert (vagy pushold a Vercel/Hostinger szerverre), és a grafikonok azonnal megjelennek itt!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
