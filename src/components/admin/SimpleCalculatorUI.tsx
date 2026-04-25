'use client';

import { useState } from 'react';
import { createJob, updateJob } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Save, ShoppingCart, User, MapPin, ReceiptText } from 'lucide-react';

interface Props {
  pricingRug: any;
  pricingUpholstery: any;
  pricingCar: any;
  deliveryFeeLimit: number;
  deliveryFeeBase: number;
  initialJob?: any;
}

export default function SimpleCalculatorUI({ pricingRug, pricingUpholstery, pricingCar, deliveryFeeLimit, deliveryFeeBase, initialJob }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rug' | 'upholstery' | 'car'>('rug');

  const [items, setItems] = useState<any[]>(() => {
    if (initialJob?.data_json) {
      try {
        return JSON.parse(initialJob.data_json);
      } catch(e) {}
    }
    return [];
  });

  // Item Forms State
  const [rug, setRug] = useState({ 
    type: Object.keys(pricingRug.types || {})[0] || '', 
    width: 100, 
    length: 150, 
    material: Object.keys(pricingRug.materials || {})[0] || '', 
    condition: Object.keys(pricingRug.conditions || {})[0] || '', 
    extras: [] as string[], 
    manualPrice: 0 
  });
  const [uph, setUph] = useState({ 
    type: Object.keys(pricingUpholstery.types || {})[0] || '', 
    quantity: 1, 
    options: [] as string[], 
    manualPrice: 0 
  });
  const [car, setCar] = useState({ 
    category: Object.keys(pricingCar.categories || {})[0] || '', 
    package: Object.keys(pricingCar.packages || {})[0] || '', 
    type: '', 
    extras: [] as string[], 
    manualPrice: 0 
  });

  // Job Details
  const [customerInfo, setCustomerInfo] = useState({ 
    name: initialJob?.name || '', 
    phone: initialJob?.phone || '',
    email: initialJob?.email || '',
    address: initialJob?.address || '', 
    notes: initialJob?.notes || '' 
  });

  // Calculation
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const delivery = subtotal >= deliveryFeeLimit || subtotal === 0 ? 0 : deliveryFeeBase;
  const total = subtotal + delivery;

  // Add Handlers
  const addRug = () => {
    let area = (rug.width * rug.length) / 10000;
    if (area > 0 && area < 1) area = 1;
    let price = Number(rug.manualPrice) || 0;

    setItems([...items, { ...rug, service: 'Szőnyeg', area, price }]);
  };
  const addUph = () => {
    let pricePerItem = Number(uph.manualPrice) || 0;
    
    let newItems = [];
    let qty = uph.quantity || 1;
    for(let i=0; i<qty; i++) {
      newItems.push({ ...uph, service: 'Kárpit', quantity: 1, price: pricePerItem });
    }
    setItems([...items, ...newItems]);
  };

  const addCar = () => {
    let price = Number(car.manualPrice) || 0;
    setItems([...items, { ...car, service: 'Autó', price }]);
  };

  const handleSave = async () => {
    if (!customerInfo.name || !customerInfo.address) return alert("Név és Cím kötelező!");
    if (items.length === 0) return alert("Adj hozzá legalább egy tételt!");
    
    if (initialJob?.id) {
      await updateJob(initialJob.id, { ...customerInfo, items, total });
    } else {
      await createJob({ ...customerInfo, items, total });
    }
    router.push('/portal');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Service Type Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
            {['rug', 'upholstery', 'car'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#1D63B7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab === 'rug' ? 'Szőnyegtisztítás' : tab === 'upholstery' ? 'Bútorkárpit' : 'Autótisztítás'}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {/* RUG ENGINE */}
            {activeTab === 'rug' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Típus</label>
                    <select className="w-full border rounded-lg p-2" value={rug.type} onChange={e => setRug({...rug, type: e.target.value})}>
                      {pricingRug.types && Object.keys(pricingRug.types).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Anyag</label>
                    <select className="w-full border rounded-lg p-2" value={rug.material} onChange={e => setRug({...rug, material: e.target.value})}>
                      {pricingRug.materials && Object.keys(pricingRug.materials).map((m:string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Szélesség (cm)</label>
                    <input type="number" className="w-full border rounded-lg p-2" value={rug.width} onChange={e => setRug({...rug, width: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Hosszúság (cm)</label>
                    <input type="number" className="w-full border rounded-lg p-2" value={rug.length} onChange={e => setRug({...rug, length: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Állapot (Szennyeződés)</label>
                  <select className="w-full border rounded-lg p-2" value={rug.condition} onChange={e => setRug({...rug, condition: e.target.value})}>
                    {pricingRug.conditions && Object.keys(pricingRug.conditions).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Extrák</label>
                  <div className="flex flex-wrap gap-2">
                    {pricingRug.extras && Object.keys(pricingRug.extras).map(ext => (
                      <label key={ext} className="flex items-center gap-2 border p-2 rounded-lg text-sm bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={rug.extras.includes(ext)} onChange={e => {
                          const ne = e.target.checked ? [...rug.extras, ext] : rug.extras.filter(x => x !== ext);
                          setRug({...rug, extras: ne});
                        }} />
                        {ext}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#1D63B7] mb-1 font-bold">Kézi Ár megadása (Ft)</label>
                  <input type="number" className="w-full border-2 border-[#1D63B7] rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#3AC2FE]" value={rug.manualPrice || ''} onChange={e => setRug({...rug, manualPrice: Number(e.target.value)})} placeholder="Pl: 4500" />
                </div>
                <button onClick={addRug} className="mt-4 flex items-center justify-center gap-2 w-full bg-[#3AC2FE] hover:bg-[#1D63B7] text-white py-3 rounded-xl font-medium transition-colors">
                  <Plus size={20} /> Szőnyeg hozzáadása
                </button>
              </div>
            )}

            {/* UPHOLSTERY ENGINE */}
            {activeTab === 'upholstery' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Bútor típusa</label>
                    <select className="w-full border rounded-lg p-2" value={uph.type} onChange={e => setUph({...uph, type: e.target.value})}>
                      {pricingUpholstery.types && Object.keys(pricingUpholstery.types).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Mennyiség (db)</label>
                    <input type="number" min={1} className="w-full border rounded-lg p-2" value={uph.quantity} onChange={e => setUph({...uph, quantity: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Opciók</label>
                  <div className="flex flex-wrap gap-2">
                    {pricingUpholstery.options && Object.keys(pricingUpholstery.options).map(opt => (
                      <label key={opt} className="flex items-center gap-2 border p-2 rounded-lg text-sm bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={uph.options.includes(opt)} onChange={e => {
                          const no = e.target.checked ? [...uph.options, opt] : uph.options.filter(x => x !== opt);
                          setUph({...uph, options: no});
                        }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#1D63B7] mb-1 font-bold">Kézi Ár megadása / db (Ft)</label>
                  <input type="number" className="w-full border-2 border-[#1D63B7] rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#3AC2FE]" value={uph.manualPrice || ''} onChange={e => setUph({...uph, manualPrice: Number(e.target.value)})} placeholder="Pl: 5000" />
                </div>
                <button onClick={addUph} className="mt-4 flex items-center justify-center gap-2 w-full bg-[#3AC2FE] hover:bg-[#1D63B7] text-white py-3 rounded-xl font-medium transition-colors">
                  <Plus size={20} /> Kárpit hozzáadása
                </button>
              </div>
            )}

            {/* CAR ENGINE */}
            {activeTab === 'car' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Csomag (Alapár)</label>
                    <select className="w-full border rounded-lg p-2" value={car.package} onChange={e => setCar({...car, package: e.target.value})}>
                      {pricingCar.packages && Object.keys(pricingCar.packages).map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Kategória (Felár)</label>
                    <select className="w-full border rounded-lg p-2" value={car.category} onChange={e => setCar({...car, category: e.target.value})}>
                      {pricingCar.categories && Object.keys(pricingCar.categories).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Autó Típusa</label>
                  <input type="text" className="w-full border rounded-lg p-2" placeholder="Pl: BMW X5" value={car.type} onChange={e => setCar({...car, type: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Kiegészítő Extrák</label>
                  <div className="flex flex-wrap gap-2">
                    {pricingCar.extras && Object.keys(pricingCar.extras).map(ext => (
                      <label key={ext} className={`flex items-center gap-2 border p-2 rounded-lg text-sm bg-gray-50 cursor-pointer transition-all ${car.extras.includes(ext) ? 'border-[#3AC2FE] bg-[#3AC2FE]/10 ring-1 ring-[#3AC2FE]' : ''}`}>
                        <input type="checkbox" className="hidden" checked={car.extras.includes(ext)} onChange={e => {
                          const ne = e.target.checked ? [...car.extras, ext] : car.extras.filter(x => x !== ext);
                          setCar({...car, extras: ne});
                        }} />
                        {ext}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#1D63B7] mb-1 font-bold">Kézi Ár megadása (Ft)</label>
                  <input type="number" className="w-full border-2 border-[#1D63B7] rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#3AC2FE]" value={car.manualPrice || ''} onChange={e => setCar({...car, manualPrice: Number(e.target.value)})} placeholder="Pl: 25000" />
                </div>
                <button onClick={addCar} className="mt-4 flex items-center justify-center gap-2 w-full bg-[#3AC2FE] hover:bg-[#1D63B7] text-white py-3 rounded-xl font-medium transition-colors">
                  <Plus size={20} /> Autó hozzáadása
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Forms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-4">
            <User className="text-[#1D63B7]" /> Ügyfél Adatok
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Név</label>
              <input type="text" className="w-full border rounded-lg p-2" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Példa János" required />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Telefonszám</label>
              <input type="text" className="w-full border rounded-lg p-2" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="+36 30 123 4567" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cím (Google Térképhez)</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 w-full border rounded-lg p-2" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} placeholder="1024, Budapest, Példa utca 12." required />
                {customerInfo.address && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerInfo.address)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1D63B7] hover:bg-[#3AC2FE] text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0" title="Útvonaltervezés Térképen">
                    <MapPin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div>
             <label className="block text-sm text-gray-500 mb-1 text-[#FEC500]">Gyorsjegyzet (Belső)</label>
             <textarea rows={2} className="w-full border rounded-lg p-2 font-mono text-sm" value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} placeholder="Pl.: Vigyázni a rojtos szélre, csengő nem jó..."></textarea>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-fit sticky top-6">
        <h3 className="text-xl font-bold text-[#181A2C] flex items-center gap-2 mb-4 border-b pb-4">
          <ShoppingCart className="text-[#1D63B7]" /> Rendelés Összesítő
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px] mb-6">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center text-sm mt-4">Nincsenek tételek.</p>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="font-bold text-[#181A2C]">{it.service} ({it.type || it.package || 'Egyéb'})</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {it.service === 'Szőnyeg' ? `${it.width || it.w}x${it.length || it.l}cm (${it.area?.toFixed(2)}m2) ${it.condition}` : ''}
                    {it.service === 'Kárpit' ? `${it.quantity || 1} darab` : ''}
                    {it.service === 'Autó' ? `${it.category} kategória` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-medium">{it.price.toLocaleString('hu-HU')} Ft</span>
                  <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 mt-1">
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Részösszeg</span>
            <span>{subtotal.toLocaleString('hu-HU')} Ft</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Kiszállási díj 
               {subtotal < deliveryFeeLimit && subtotal > 0 && <span className="text-xs ml-1 block text-orange-400">Keret: {deliveryFeeLimit.toLocaleString('hu-HU')} Ft alatt</span>}
            </span>
            <span>{delivery.toLocaleString('hu-HU')} Ft</span>
          </div>
          <div className="flex justify-between text-xl font-black text-[#1D63B7] pt-2 border-t mt-2">
            <span>Végösszeg</span>
            <span>{total.toLocaleString('hu-HU')} Ft</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full bg-[#1D63B7] hover:bg-[#3AC2FE] text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg"
        >
          <Save size={20} /> {initialJob ? 'Változtatások Mentése' : 'Munka Mentése'}
        </button>      </div>
    </div>
  );
}
