"use client";

import { useState } from "react";
import { Plus, Trash2, Calculator, CheckSquare, Square } from "lucide-react";

interface QuoteFormProps {
  action: (formData: FormData) => void;
  buttonText: string;
}

export default function QuoteForm({ action, buttonText }: QuoteFormProps) {
  const [services, setServices] = useState({
    rug: false,
    upholstery: false,
    car: false,
  });

  const [advancedMode, setAdvancedMode] = useState(false);
  const [simpleMessage, setSimpleMessage] = useState("");

  // Advanced mode state
  const [rugs, setRugs] = useState<{ w: string; l: string }[]>([]);
  const [upholsteries, setUpholsteries] = useState<{ type: string; desc: string }[]>([]);
  const [cars, setCars] = useState<{ size: string; type: string }[]>([]);

  const addRug = () => setRugs([...rugs, { w: "", l: "" }]);
  const removeRug = (idx: number) => setRugs(rugs.filter((_, i) => i !== idx));

  const addUph = () => setUpholsteries([...upholsteries, { type: "Kanapé", desc: "" }]);
  const removeUph = (idx: number) => setUpholsteries(upholsteries.filter((_, i) => i !== idx));

  const addCar = () => setCars([...cars, { size: "Közepes", type: "" }]);
  const removeCar = (idx: number) => setCars(cars.filter((_, i) => i !== idx));

  const generatedServiceType = [
    services.rug ? "Szőnyegtisztítás" : null,
    services.upholstery ? "Kárpittisztítás" : null,
    services.car ? "Autókozmetika" : null,
  ]
    .filter(Boolean)
    .join(", ") || "Nincs megadva szolgáltatás";

  const generatedMessage = () => {
    if (!advancedMode) {
      let result = simpleMessage;
      if (simpleMessage.trim() === "") {
        result = "Nincs megadva további információ.";
      }
      return result;
    }

    let msg = "";
    if (services.rug && rugs.length > 0) {
      msg += "--- Szőnyegek ---\n";
      let totalArea = 0;
      rugs.forEach((r, i) => {
        const w = parseFloat(r.w.replace(',', '.')) || 0;
        const l = parseFloat(r.l.replace(',', '.')) || 0;
        const area = w * l;
        totalArea += area;
        msg += `${i + 1}. Szőnyeg: ${w} m x ${l} m = ${area.toFixed(2)} m²\n`;
      });
      msg += `Összes Szőnyeg: ${totalArea.toFixed(2)} m²\n\n`;
    }

    if (services.upholstery && upholsteries.length > 0) {
      msg += "--- Kárpitok ---\n";
      upholsteries.forEach((u, i) => {
        msg += `${i + 1}. ${u.type}${u.desc ? ` - Részletek: ${u.desc}` : ""}\n`;
      });
      msg += "\n";
    }

    if (services.car && cars.length > 0) {
      msg += "--- Autók ---\n";
      cars.forEach((c, i) => {
        msg += `${i + 1}. ${c.size} méretű autó${c.type ? ` - ${c.type}` : ""}\n`;
      });
      msg += "\n";
    }

    const finalMsg = msg.trim();
    return finalMsg ? finalMsg : "Haladó mód lett kiválasztva, de nem lett tétel hozzáadva.";
  };

  const handleServiceToggle = (key: keyof typeof services) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form action={action} className="space-y-8">
      {/* Hidden inputs for Server Action */}
      <input type="hidden" name="service_type" value={generatedServiceType} />
      <input type="hidden" name="message" value={generatedMessage()} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Teljes Név *</label>
          <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="Példa János" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Telefonszám *</label>
          <input type="tel" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="+36 30 123 4567" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Település és utca *</label>
        <input type="text" name="address" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="2030 Érd, Fő utca 12." />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-4">Szolgáltatások (Több is választható)</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rug Checkbox */}
          <div 
            onClick={() => handleServiceToggle('rug')}
            className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 h-full transition-all ${services.rug ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            {services.rug ? <CheckSquare className="text-[#3AC2FE] flex-shrink-0" /> : <Square className="text-gray-400 flex-shrink-0" />}
            <span className="font-bold text-sm text-[#181A2C] leading-tight">Szőnyegtisztítás</span>
          </div>
          {/* Upholstery Checkbox */}
          <div 
            onClick={() => handleServiceToggle('upholstery')}
            className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 h-full transition-all ${services.upholstery ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            {services.upholstery ? <CheckSquare className="text-[#3AC2FE] flex-shrink-0" /> : <Square className="text-gray-400 flex-shrink-0" />}
            <span className="font-bold text-sm text-[#181A2C] leading-tight">Kárpittisztítás</span>
          </div>
          {/* Car Checkbox */}
          <div 
            onClick={() => handleServiceToggle('car')}
            className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 h-full transition-all ${services.car ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            {services.car ? <CheckSquare className="text-[#3AC2FE] flex-shrink-0" /> : <Square className="text-gray-400 flex-shrink-0" />}
            <span className="font-bold text-sm text-[#181A2C] leading-tight">Autókozmetika</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-bold text-gray-700">Részletek (Opcionális)</label>
          <button 
            type="button" 
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${advancedMode ? 'bg-[#181A2C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Calculator size={16} />
            Haladó Mód (Pontos számolás)
          </button>
        </div>

        {!advancedMode ? (
          <textarea 
            rows={3} 
            value={simpleMessage}
            onChange={(e) => setSimpleMessage(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" 
            placeholder="Kérjük írja le röviden a tisztítandó tárgyakat (pl: 2 darab közepes szőnyeg, 1 nagy kanapé)..."
          ></textarea>
        ) : (
          <div className="space-y-8 bg-gray-50 p-6 rounded-3xl border border-gray-200">
            {/* RUG ADVANCED */}
            {services.rug && (
              <div className="space-y-4">
                <h5 className="font-bold text-[#1D63B7] border-b border-gray-200 pb-2">Szőnyegek hozzáadása</h5>
                {rugs.map((rug, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Szélesség (m)</label>
                      <input type="number" step="0.01" value={rug.w} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].w = e.target.value; setRugs(newRugs); }} placeholder="Pl: 1.5" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                    </div>
                    <span className="text-gray-400 font-bold mt-4">X</span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Hosszúság (m)</label>
                      <input type="number" step="0.01" value={rug.l} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].l = e.target.value; setRugs(newRugs); }} placeholder="Pl: 2.0" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                    </div>
                    <div className="w-full md:w-32 bg-[#3AC2FE]/10 text-[#1D63B7] rounded-lg px-3 py-2 text-center font-bold mt-4 md:mt-0">
                      {((parseFloat(rug.w) || 0) * (parseFloat(rug.l) || 0)).toFixed(2)} m²
                    </div>
                    <button type="button" onClick={() => removeRug(idx)} className="mt-4 md:mt-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addRug} className="flex items-center gap-2 text-sm font-bold text-[#1D63B7] hover:text-[#3AC2FE] transition-colors">
                  <Plus size={16} /> Új szőnyeg
                </button>
              </div>
            )}

            {/* UPHOLSTERY ADVANCED */}
            {services.upholstery && (
              <div className="space-y-4">
                <h5 className="font-bold text-[#1D63B7] border-b border-gray-200 pb-2">Kárpitok hozzáadása</h5>
                {upholsteries.map((uph, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs text-gray-500 mb-1">Típus</label>
                      <select value={uph.type} onChange={(e) => { const newUph = [...upholsteries]; newUph[idx].type = e.target.value; setUpholsteries(newUph); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]">
                        <option>Kanapé</option>
                        <option>Fotel</option>
                        <option>Matrac</option>
                        <option>Szék</option>
                        <option>Egyéb</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Méretek / Részletek</label>
                      <input type="text" value={uph.desc} onChange={(e) => { const newUph = [...upholsteries]; newUph[idx].desc = e.target.value; setUpholsteries(newUph); }} placeholder="Pl: 3 személyes L-alakú" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                    </div>
                    <button type="button" onClick={() => removeUph(idx)} className="mt-4 md:mt-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addUph} className="flex items-center gap-2 text-sm font-bold text-[#1D63B7] hover:text-[#3AC2FE] transition-colors">
                  <Plus size={16} /> Új kárpit
                </button>
              </div>
            )}

            {/* CAR ADVANCED */}
            {services.car && (
              <div className="space-y-4">
                <h5 className="font-bold text-[#1D63B7] border-b border-gray-200 pb-2">Autók hozzáadása</h5>
                {cars.map((car, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-full md:w-1/3">
                      <label className="block text-xs text-gray-500 mb-1">Autó Mérete</label>
                      <select value={car.size} onChange={(e) => { const newCars = [...cars]; newCars[idx].size = e.target.value; setCars(newCars); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]">
                        <option>Kisméretű</option>
                        <option>Közepes</option>
                        <option>Nagyméretű (SUV/Egyterű)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Autó Típusa / Részletek</label>
                      <input type="text" value={car.type} onChange={(e) => { const newCars = [...cars]; newCars[idx].type = e.target.value; setCars(newCars); }} placeholder="Pl: Ford Focus Kombi" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                    </div>
                    <button type="button" onClick={() => removeCar(idx)} className="mt-4 md:mt-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addCar} className="flex items-center gap-2 text-sm font-bold text-[#1D63B7] hover:text-[#3AC2FE] transition-colors">
                  <Plus size={16} /> Új autó
                </button>
              </div>
            )}

            {!services.rug && !services.upholstery && !services.car && (
              <p className="text-gray-500 italic text-sm">A haladó mód használatához válasszon ki fent legalább egy szolgáltatást.</p>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="w-full bg-[#181A2C] hover:bg-[#1D63B7] text-white font-bold text-xl py-5 rounded-2xl transition-all shadow-[0_20px_40px_rgba(24,26,44,0.3)] hover:shadow-[0_20px_40px_rgba(29,99,183,0.4)]">
        {buttonText}
      </button>
    </form>
  );
}
