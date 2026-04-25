import { BarChart3, TrendingUp, Users, MousePointerClick, Clock, Search, Lock, Zap } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      {/* Header & Upsell Banner */}
      <div className="bg-gradient-to-br from-[#181A2C] to-[#1D63B7] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#FEC500] font-bold mb-4 uppercase tracking-wider text-sm">
            <Lock size={16} /> Prémium DEMO Funkció
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Teljes SEO + AIO Analitika</h1>
          <p className="text-lg text-gray-200 mb-6 max-w-3xl leading-relaxed">
            Az alapvető keresőoptimalizálást az alap ár is tartalmazza, viszont ebben az opcióban a Google keresési konzollal (Search console), Címke kezelővel (Tag manager) és Analitikával (Analytics) is összekötjük a weboldalt. 
            <br/><br/>
            <strong className="text-[#3AC2FE]">AIO (AI Keresőoptimalizálás):</strong> Ha valaki egy AI-nál (pl. ChatGPT, Gemini) érdeklődik, hogyan tisztítson szőnyeget a környékeden, akkor az AI a Te vállalkozásodat fogja ajánlani!
          </p>
          <a href="mailto:whereismaco@gmail.com?subject=SEO%20%2B%20AIO%20Csomag%20Aktiv%C3%A1l%C3%A1s" className="inline-flex bg-[#FEC500] text-[#181A2C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-lg items-center gap-2">
            <Zap size={20} /> Modul Aktiválása (40.000 Ft)
          </a>
        </div>
        <BarChart3 className="absolute right-0 bottom-0 text-white/10 w-96 h-96 translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Mock Data Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-[#181A2C] mb-6 flex items-center gap-2">
          <BarChart3 className="text-[#3AC2FE]" />
          Így nézne ki a valós idejű statisztikád:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pointer-events-none select-none">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-70 grayscale-[30%]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={24} />
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center gap-1"><TrendingUp size={14} /> +24%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Havi Látogatók</p>
              <h3 className="text-3xl font-black text-[#181A2C]">1,248</h3>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-70 grayscale-[30%]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <MousePointerClick size={24} />
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center gap-1"><TrendingUp size={14} /> +12%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Konverziós arány (Ajánlatkérés)</p>
              <h3 className="text-3xl font-black text-[#181A2C]">4.2%</h3>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-70 grayscale-[30%]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Clock size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Átlagos oldalon töltött idő</p>
              <h3 className="text-3xl font-black text-[#181A2C]">2p 45mp</h3>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-70 grayscale-[30%]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Search size={24} />
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center gap-1"><TrendingUp size={14} /> AI</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Google / AI Keresésekből</p>
              <h3 className="text-3xl font-black text-[#181A2C]">68%</h3>
            </div>
          </div>
        </div>

        {/* Charts Mock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-none select-none">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-70 grayscale-[30%] h-80 flex flex-col justify-between">
            <h4 className="font-bold text-[#181A2C] mb-4">Látogatottság az elmúlt 30 napban</h4>
            <div className="flex-1 flex items-end gap-2 justify-between">
              {Array.from({length: 30}).map((_, i) => (
                <div key={i} className="bg-[#3AC2FE] w-full rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%`}}></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-70 grayscale-[30%] flex flex-col">
            <h4 className="font-bold text-[#181A2C] mb-6">Forgalom Forrása</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Google Kereső (SEO)</span><span className="font-bold text-[#181A2C]">45%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-[#1D63B7] h-2.5 rounded-full" style={{width: '45%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Facebook / Instagram Ads</span><span className="font-bold text-[#181A2C]">30%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-[#3AC2FE] h-2.5 rounded-full" style={{width: '30%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">AI Chatbotok (ChatGPT)</span><span className="font-bold text-[#181A2C]">15%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full" style={{width: '15%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Közvetlen (Direct)</span><span className="font-bold text-[#181A2C]">10%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-[#FEC500] h-2.5 rounded-full" style={{width: '10%'}}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
