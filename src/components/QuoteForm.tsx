"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Calculator, CheckSquare, Square } from "lucide-react";

interface QuoteFormProps {
  action: (formData: FormData) => void;
  buttonText: string;
  pricingRug: any;
  pricingUph: any;
  pricingCar: any;
  deliveryFeeBase: number;
  deliveryFeeLimit: number;
}

export default function QuoteForm({ action, buttonText, pricingRug, pricingUph, pricingCar, deliveryFeeBase, deliveryFeeLimit }: QuoteFormProps) {
  const [services, setServices] = useState({
    rug: false,
    upholstery: false,
    car: false,
  });

  const [advancedMode, setAdvancedMode] = useState(false);
  const [simpleMessage, setSimpleMessage] = useState("");

  // Dynamic Options
  const rugTypes = Object.keys(pricingRug?.types || {});
  const rugMaterials = Object.keys(pricingRug?.materials || {});
  const rugConditions = Object.keys(pricingRug?.conditions || {});
  const rugExtras = Object.keys(pricingRug?.extras || {});

  const uphTypes = Object.keys(pricingUph?.types || {});
  const carSizes = Object.keys(pricingCar?.categories || {});
  const carPackages = Object.keys(pricingCar?.packages || {});
  const carExtras = Object.keys(pricingCar?.extras || {});

  // Advanced mode state
  const [rugs, setRugs] = useState<{ w: string; l: string; thickness: string; dirtiness: string; material: string; extras: string[] }[]>([]);
  const [upholsteries, setUpholsteries] = useState<{ type: string; desc: string; quantity: number }[]>([]);
  const [cars, setCars] = useState<{ size: string; type: string; pkg: string; extras: string[] }[]>([]);

  const addRug = () => setRugs([...rugs, { w: "", l: "", thickness: rugTypes[0] || "", dirtiness: rugConditions[0] || "", material: rugMaterials[0] || "", extras: [] }]);
  const removeRug = (idx: number) => setRugs(rugs.filter((_, i) => i !== idx));

  const addUph = () => setUpholsteries([...upholsteries, { type: uphTypes[0] || "", desc: "", quantity: 1 }]);
  const removeUph = (idx: number) => setUpholsteries(upholsteries.filter((_, i) => i !== idx));

  const addCar = () => setCars([...cars, { size: carSizes[0] || "", pkg: carPackages[0] || "", type: "", extras: [] }]);
  const removeCar = (idx: number) => setCars(cars.filter((_, i) => i !== idx));

  const generatedServiceType = [
    services.rug ? "Szőnyegtisztítás" : null,
    services.upholstery ? "Kárpittisztítás" : null,
    services.car ? "Autókozmetika" : null,
  ]
    .filter(Boolean)
    .join(", ") || "Nincs megadva szolgáltatás";

  const { message: generatedMessage, total: estimatedTotal, subtotal: estimatedSubtotal, delivery: estimatedDelivery, items: structuredItems } = useMemo(() => {
    let total = 0;
    if (!advancedMode) {
      let result = simpleMessage;
      if (simpleMessage.trim() === "") {
        result = "Nincs megadva további információ.";
      }
      return { message: result, total: 0, subtotal: 0, delivery: 0, items: [] };
    }

    let msg = "";
    let items: any[] = [];

    if (services.rug && rugs.length > 0) {
      msg += "--- Szőnyegek ---\n";
      let totalArea = 0;
      let rugsTotal = 0;
      rugs.forEach((r, i) => {
        const w = parseFloat(r.w.replace(',', '.')) || 0;
        const l = parseFloat(r.l.replace(',', '.')) || 0;
        let area = (w * l) / 10000;
        if (area > 0 && area < 1) area = 1; // minimum 1 nm
        totalArea += area;

        let basePrice = Number(pricingRug?.types?.[r.thickness]) || 0;
        let matPrice = Number(pricingRug?.materials?.[r.material]) || 0;
        let condPrice = Number(pricingRug?.conditions?.[r.dirtiness]) || 0;
        let extrasPrice = r.extras.reduce((sum, ext) => sum + (Number(pricingRug?.extras?.[ext]) || 0), 0);

        let rugPrice = area * (basePrice + matPrice + condPrice + extrasPrice);
        if (isNaN(rugPrice)) rugPrice = 0;

        rugsTotal += rugPrice;
        total += rugPrice;

        items.push({
          service: 'Szőnyeg',
          w: r.w,
          l: r.l,
          area: area,
          type: r.thickness,
          material: r.material,
          condition: r.dirtiness,
          extras: r.extras,
          price: rugPrice
        });

        msg += `${i + 1}. Szőnyeg: ${w} cm x ${l} cm = ${area.toFixed(2)} m² (Becsült ár: ~${rugPrice.toLocaleString('hu-HU')} Ft)\n`;
        msg += `   Vastagság: ${r.thickness} | Anyag: ${r.material} | Szennyeződés: ${r.dirtiness}\n`;
        if (r.extras.length > 0) {
          msg += `   Extrák: ${r.extras.join(', ')}\n`;
        }
      });
      msg += `\nÖsszes Szőnyeg: ${totalArea.toFixed(2)} m² (Összesen kb. ${rugsTotal.toLocaleString('hu-HU')} Ft)\n\n`;
    }

    if (services.upholstery && upholsteries.length > 0) {
      msg += "--- Kárpitok ---\n";
      let uphTotal = 0;
      upholsteries.forEach((u, i) => {
        let uPrice = Number(pricingUph?.types?.[u.type]) || 0;
        if (isNaN(uPrice)) uPrice = 0;
        
        let qty = u.quantity || 1;
        let rowPrice = uPrice * qty;
        uphTotal += rowPrice;
        total += rowPrice;

        for (let j = 0; j < qty; j++) {
          items.push({
            service: 'Kárpit',
            type: u.type,
            options: u.desc ? [u.desc] : [],
            quantity: 1,
            price: uPrice
          });
        }

        msg += `${i + 1}. ${u.type}${u.desc ? ` - Részletek: ${u.desc}` : ""} | ${qty} db (Becsült ár: ~${rowPrice.toLocaleString('hu-HU')} Ft)\n`;
      });
      msg += `\nÖsszes Kárpit kb. ${uphTotal.toLocaleString('hu-HU')} Ft\n\n`;
    }

    if (services.car && cars.length > 0) {
      msg += "--- Autók ---\n";
      let carsTotal = 0;
      cars.forEach((c, i) => {
        let pkgData = pricingCar?.packages?.[c.pkg];
        let pkgPrice = typeof pkgData === 'object' ? (Number(pkgData.price) || 0) : (Number(pkgData) || 0);
        let catPrice = Number(pricingCar?.categories?.[c.size]) || 0;
        let extrasPrice = c.extras.reduce((sum, ext) => sum + (Number(pricingCar?.extras?.[ext]) || 0), 0);

        let cPrice = pkgPrice + catPrice + extrasPrice;
        if (isNaN(cPrice)) cPrice = 0;

        carsTotal += cPrice;
        total += cPrice;

        items.push({
          service: 'Autó',
          package: c.pkg,
          category: c.size,
          type: c.type,
          extras: c.extras,
          price: cPrice
        });

        msg += `${i + 1}. ${c.pkg} csomag | ${c.size} méret${c.type ? ` (${c.type})` : ""} (Becsült ár: ~${cPrice.toLocaleString('hu-HU')} Ft)\n`;
        if (c.extras.length > 0) {
          msg += `   Extrák: ${c.extras.join(', ')}\n`;
        }
      });
      msg += `\nÖsszes Autó kb. ${carsTotal.toLocaleString('hu-HU')} Ft\n\n`;
    }

    let subtotal = total;
    let delivery = 0;
    
    if (subtotal > 0 && !isNaN(subtotal)) {
      if (subtotal < deliveryFeeLimit) {
        delivery = deliveryFeeBase;
      }
      total = subtotal + delivery;

      if (delivery > 0) {
        msg += `\nKiszállási díj: ${delivery.toLocaleString('hu-HU')} Ft (Ingyenes kiszállítás ${deliveryFeeLimit.toLocaleString('hu-HU')} Ft felett)\n`;
      } else {
        msg += `\nKiszállási díj: Ingyenes (A rendelés elérte a ${deliveryFeeLimit.toLocaleString('hu-HU')} Ft-ot)\n`;
      }
      
      msg += `==========================\nTeljes Becsült Végösszeg (Kiszállással): ~${total.toLocaleString('hu-HU')} Ft\n==========================`;
    } else {
      total = 0;
      subtotal = 0;
    }

    const finalMsg = msg.trim();
    return { message: finalMsg ? finalMsg : "Haladó mód lett kiválasztva, de nem lett tétel hozzáadva.", total, subtotal, delivery, items };
  }, [advancedMode, simpleMessage, services, rugs, upholsteries, cars, pricingRug, pricingUph, pricingCar, deliveryFeeBase, deliveryFeeLimit]);

  const handleServiceToggle = (key: keyof typeof services) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form action={action} className="space-y-8">
      {/* Hidden inputs for Server Action */}
      <input type="hidden" name="service_type" value={generatedServiceType} />
      <input type="hidden" name="message" value={generatedMessage} />
      <input type="hidden" name="total" value={estimatedTotal || 0} />
      <input type="hidden" name="items_json" value={JSON.stringify(structuredItems)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Név *</label>
          <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="Példa János" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Telefonszám *</label>
          <input type="tel" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="+36 30 123 4567" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Cím *</label>
          <input type="email" name="email" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="pelda@email.hu" />
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
            className={`cursor-pointer flex items-center justify-center p-4 rounded-2xl border-2 h-full transition-all text-center ${services.rug ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            <span className="font-bold text-sm text-[#181A2C] leading-tight">Szőnyegtisztítás</span>
          </div>
          {/* Upholstery Checkbox */}
          <div 
            onClick={() => handleServiceToggle('upholstery')}
            className={`cursor-pointer flex items-center justify-center p-4 rounded-2xl border-2 h-full transition-all text-center ${services.upholstery ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            <span className="font-bold text-sm text-[#181A2C] leading-tight">Kárpittisztítás</span>
          </div>
          {/* Car Checkbox */}
          <div 
            onClick={() => handleServiceToggle('car')}
            className={`cursor-pointer flex items-center justify-center p-4 rounded-2xl border-2 h-full transition-all text-center ${services.car ? 'bg-[#3AC2FE]/10 border-[#3AC2FE]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
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
                  <div key={idx} className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Szélesség (cm)</label>
                        <input type="number" step="1" value={rug.w} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].w = e.target.value; setRugs(newRugs); }} placeholder="Pl: 150" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                      </div>
                      <span className="text-gray-400 font-bold mt-4">X</span>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Hosszúság (cm)</label>
                        <input type="number" step="1" value={rug.l} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].l = e.target.value; setRugs(newRugs); }} placeholder="Pl: 200" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
                      </div>
                      <div className="w-full md:w-32 bg-[#3AC2FE]/10 text-[#1D63B7] rounded-lg px-3 py-2 text-center font-bold mt-4 md:mt-0">
                        {((parseFloat(rug.w) || 0) * (parseFloat(rug.l) || 0) / 10000).toFixed(2)} m²
                      </div>
                      <button type="button" onClick={() => removeRug(idx)} className="mt-4 md:mt-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-50">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Vastagság</label>
                        <select value={rug.thickness} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].thickness = e.target.value; setRugs(newRugs); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm">
                          {rugTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Szőnyeg Anyaga</label>
                        <select value={rug.material} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].material = e.target.value; setRugs(newRugs); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm">
                          {rugMaterials.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Szennyeződés Mértéke</label>
                        <select value={rug.dirtiness} onChange={(e) => { const newRugs = [...rugs]; newRugs[idx].dirtiness = e.target.value; setRugs(newRugs); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm">
                          {rugConditions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs text-gray-500 mb-2">Extrák (Több is választható)</label>
                      <div className="flex flex-wrap gap-2">
                        {rugExtras.map((extra) => (
                          <div 
                            key={extra}
                            onClick={() => {
                              const newRugs = [...rugs];
                              if (newRugs[idx].extras.includes(extra)) {
                                newRugs[idx].extras = newRugs[idx].extras.filter(e => e !== extra);
                              } else {
                                newRugs[idx].extras.push(extra);
                              }
                              setRugs(newRugs);
                            }}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${rug.extras.includes(extra) ? 'bg-[#3AC2FE] border-[#3AC2FE] text-[#1D63B7] font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {extra}
                          </div>
                        ))}
                      </div>
                    </div>

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
                        {uphTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Db</label>
                      <input type="number" min="1" value={uph.quantity || 1} onChange={(e) => { const newUph = [...upholsteries]; newUph[idx].quantity = Math.max(1, parseInt(e.target.value) || 1); setUpholsteries(newUph); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE]" />
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
                  <div key={idx} className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Választott Csomag</label>
                        <select value={car.pkg} onChange={(e) => { const newCars = [...cars]; newCars[idx].pkg = e.target.value; setCars(newCars); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm">
                          {carPackages.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Gépjármű Kategória</label>
                        <select value={car.size} onChange={(e) => { const newCars = [...cars]; newCars[idx].size = e.target.value; setCars(newCars); }} className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm">
                          {carSizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Autó Típusa / Részletek</label>
                      <input type="text" value={car.type} onChange={(e) => { const newCars = [...cars]; newCars[idx].type = e.target.value; setCars(newCars); }} placeholder="Pl: Ford Focus Kombi" className="w-full bg-gray-50 border rounded-lg px-3 py-2 outline-none focus:border-[#3AC2FE] text-sm" />
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs text-gray-500 mb-2">Kiegészítő Extrák</label>
                      <div className="flex flex-wrap gap-2">
                        {carExtras.map((extra) => (
                          <div 
                            key={extra}
                            onClick={() => {
                              const newCars = [...cars];
                              if (newCars[idx].extras.includes(extra)) {
                                newCars[idx].extras = newCars[idx].extras.filter(e => e !== extra);
                              } else {
                                newCars[idx].extras.push(extra);
                              }
                              setCars(newCars);
                            }}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${car.extras.includes(extra) ? 'bg-[#3AC2FE] border-[#3AC2FE] text-[#1D63B7] font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {extra}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="button" onClick={() => removeCar(idx)} className="self-end p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
                      <Trash2 size={16} /> Autó törlése
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addCar} className="flex items-center gap-2 text-sm font-bold text-[#1D63B7] hover:text-[#3AC2FE] transition-colors">
                  <Plus size={16} /> Új autó hozzáadása
                </button>
              </div>
            )}

            {!services.rug && !services.upholstery && !services.car && (
              <p className="text-gray-500 italic text-sm">A haladó mód használatához válasszon ki fent legalább egy szolgáltatást.</p>
            )}
          </div>
        )}
      </div>

      {/* Ez a konténer rejthető el később egyszerűen css-el vagy feltétellel */}
      <div className="quote-summary-container">
        {advancedMode && estimatedTotal > 0 && (
          <div className="bg-[#3AC2FE]/10 border border-[#3AC2FE]/30 rounded-2xl p-6 flex flex-col gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3AC2FE]/20 pb-4">
              <div>
                <h4 className="text-lg font-bold text-[#1D63B7]">Kiszállási díj</h4>
                {estimatedDelivery === 0 ? (
                  <p className="text-sm text-gray-500 mt-1">A rendelés elérte a(z) {deliveryFeeLimit.toLocaleString('hu-HU')} Ft-os limitet.</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">Ingyenes kiszállítás {deliveryFeeLimit.toLocaleString('hu-HU')} Ft felett.</p>
                )}
              </div>
              <div className="text-xl font-bold text-[#181A2C]">
                {estimatedDelivery === 0 ? 'Ingyenes' : `${estimatedDelivery.toLocaleString('hu-HU')} Ft`}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-2xl font-black text-[#1D63B7]">Becsült Végösszeg</h4>
                <p className="text-sm text-gray-500 mt-1">Az itt látható ár tájékoztató jellegű a megadott adatok alapján.</p>
              </div>
              <div className="text-4xl font-black text-[#181A2C]">
                ~{estimatedTotal.toLocaleString('hu-HU')} <span className="text-xl text-gray-500">Ft</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="w-full bg-[#181A2C] hover:bg-[#1D63B7] text-white font-bold text-xl py-5 rounded-2xl transition-all shadow-[0_20px_40px_rgba(24,26,44,0.3)] hover:shadow-[0_20px_40px_rgba(29,99,183,0.4)]">
        {buttonText}
      </button>
    </form>
  );
}
