'use client';

import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';

function DictEditor({ title, data, onChange, unit = "Ft" }: { title: string, data: Record<string, number>, onChange: (d: Record<string, number>) => void, unit?: string }) {
  const [items, setItems] = useState<{id: string, k: string, v: number}[]>(() => {
    return Object.entries(data || {}).map(([k, v]) => ({ id: Math.random().toString(), k, v }));
  });

  const sync = (newItems: {id: string, k: string, v: number}[]) => {
    const obj: Record<string, number> = {};
    newItems.forEach(item => {
      if (item.k.trim() !== '') obj[item.k.trim()] = item.v;
    });
    onChange(obj);
  };

  const updateKey = (id: string, newK: string) => {
    const newItems = items.map(it => it.id === id ? { ...it, k: newK } : it);
    setItems(newItems);
    sync(newItems);
  };

  const updateValue = (id: string, newV: number) => {
    const newItems = items.map(it => it.id === id ? { ...it, v: newV } : it);
    setItems(newItems);
    sync(newItems);
  };

  const remove = (id: string) => {
    const newItems = items.filter(it => it.id !== id);
    setItems(newItems);
    sync(newItems);
  };

  const add = () => {
    const newItems = [...items, { id: Math.random().toString(), k: 'Új Tétel', v: 0 }];
    setItems(newItems);
    sync(newItems);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-bold text-[#181A2C] text-sm">{title}</h5>
        <button type="button" onClick={add} className="text-xs bg-[#1D63B7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3AC2FE] flex items-center gap-1 transition-colors font-medium">
          <Plus size={14} /> Hozzáadás
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input 
              type="text" 
              value={item.k} 
              onChange={e => updateKey(item.id, e.target.value)} 
              className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]" 
              placeholder="Megnevezés"
            />
            <input 
              type="number" 
              value={item.v} 
              onChange={e => updateValue(item.id, Number(e.target.value))} 
              className="w-24 border border-gray-200 rounded-lg p-2 text-sm text-right focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]" 
            />
            <span className="text-sm text-gray-500 font-medium w-4">Ft</span>
            <button 
              type="button" 
              onClick={() => remove(item.id)} 
              className="text-gray-300 hover:text-red-500 p-2 transition-colors"
              title="Törlés"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 italic">Nincsenek tételek megadva.</p>}
      </div>
    </div>
  );
}

function ListEditor({ title, data, onChange }: { title: string, data: string[], onChange: (d: string[]) => void }) {
  const [items, setItems] = useState<{id: string, val: string}[]>(() => {
    return (data || []).map(val => ({ id: Math.random().toString(), val }));
  });

  const sync = (newItems: {id: string, val: string}[]) => {
    onChange(newItems.map(it => it.val.trim()).filter(v => v !== ''));
  };

  const update = (id: string, newVal: string) => {
    const newItems = items.map(it => it.id === id ? { ...it, val: newVal } : it);
    setItems(newItems);
    sync(newItems);
  };

  const remove = (id: string) => {
    const newItems = items.filter(it => it.id !== id);
    setItems(newItems);
    sync(newItems);
  };

  const add = () => {
    const newItems = [...items, { id: Math.random().toString(), val: 'Új Anyag' }];
    setItems(newItems);
    sync(newItems);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-bold text-[#181A2C] text-sm">{title}</h5>
        <button type="button" onClick={add} className="text-xs bg-[#1D63B7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3AC2FE] flex items-center gap-1 transition-colors font-medium">
          <Plus size={14} /> Hozzáadás
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input 
              type="text" 
              value={item.val} 
              onChange={e => update(item.id, e.target.value)} 
              className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]" 
              placeholder="Megnevezés"
            />
            <button 
              type="button" 
              onClick={() => remove(item.id)} 
              className="text-gray-300 hover:text-red-500 p-2 transition-colors"
              title="Törlés"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 italic">Nincsenek tételek megadva.</p>}
      </div>
    </div>
  );
}

function PackageEditor({ title, data, onChange }: { title: string, data: Record<string, any>, onChange: (d: Record<string, any>) => void }) {
  const [items, setItems] = useState<{id: string, name: string, price: number, description: string, services: string}[]>(() => {
    return Object.entries(data || {}).map(([name, val]: [string, any]) => ({ 
      id: Math.random().toString(), 
      name, 
      price: typeof val === 'object' ? (val.price || 0) : Number(val),
      description: val.description || '',
      services: val.services || ''
    }));
  });

  const sync = (newItems: typeof items) => {
    const obj: Record<string, any> = {};
    newItems.forEach(item => {
      if (item.name.trim() !== '') {
        obj[item.name.trim()] = {
          price: item.price,
          description: item.description,
          services: item.services
        };
      }
    });
    onChange(obj);
  };

  const update = (id: string, fields: Partial<(typeof items)[0]>) => {
    const newItems = items.map(it => it.id === id ? { ...it, ...fields } : it);
    setItems(newItems);
    sync(newItems);
  };

  const remove = (id: string) => {
    const newItems = items.filter(it => it.id !== id);
    setItems(newItems);
    sync(newItems);
  };

  const add = () => {
    const newItems = [...items, { id: Math.random().toString(), name: 'Új Csomag', price: 0, description: '', services: '' }];
    setItems(newItems);
    sync(newItems);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-bold text-[#181A2C] text-sm">{title}</h5>
        <button type="button" onClick={add} className="text-xs bg-[#1D63B7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3AC2FE] flex items-center gap-1 transition-colors font-medium">
          <Plus size={14} /> Csomag Hozzáadása
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 group relative">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={item.name} 
                onChange={e => update(item.id, { name: e.target.value })} 
                className="flex-1 border border-gray-200 rounded-lg p-2 text-sm font-bold focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]" 
                placeholder="Csomag neve (pl. Rubicon Prémium)"
              />
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={item.price} 
                  onChange={e => update(item.id, { price: Number(e.target.value) })} 
                  className="w-28 border border-gray-200 rounded-lg p-2 text-sm text-right focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]" 
                />
                <span className="text-sm text-gray-500 font-medium">Ft</span>
              </div>
              <button 
                type="button" 
                onClick={() => remove(item.id)} 
                className="text-gray-300 hover:text-red-500 p-2 transition-colors"
              >
                <Trash size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Rövid leírás</label>
                <textarea 
                  value={item.description} 
                  onChange={e => update(item.id, { description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#3AC2FE]"
                  rows={2}
                  placeholder="Ez a szöveg jelenik meg a csomag alatt..."
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Szolgáltatások (vesszővel elválasztva)</label>
                <textarea 
                  value={item.services} 
                  onChange={e => update(item.id, { services: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#3AC2FE]"
                  rows={2}
                  placeholder="Kárpittisztítás, Vegyszeres mosás, Szárítás..."
                ></textarea>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">Nincsenek csomagok megadva.</p>}
      </div>
    </div>
  );
}

export default function PricingEditor({
  initialRug,
  initialUph,
  initialCar
}: {
  initialRug: any,
  initialUph: any,
  initialCar: any
}) {
  const [rug, setRug] = useState(initialRug || { types: {}, materials: {}, conditions: {}, extras: {} });
  const [uph, setUph] = useState(initialUph || { types: {}, options: {} });
  const [car, setCar] = useState(initialCar || { categories: {}, packages: {}, extras: {} });

  return (
    <div className="space-y-10 w-full">
      {/* Hidden inputs to submit the actual JSON data to the Server Action */}
      <input type="hidden" name="pricing_rug" value={JSON.stringify(rug)} />
      <input type="hidden" name="pricing_upholstery" value={JSON.stringify(uph)} />
      <input type="hidden" name="pricing_car" value={JSON.stringify(car)} />

      {/* Rug Pricing */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-xl font-black text-[#1D63B7] mb-6 flex items-center gap-2">
          1. Szőnyegtisztítás Árak
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DictEditor title="Típusok (Alapár)" data={rug.types} onChange={d => setRug({...rug, types: d})} unit="Ft/m²" />
          <DictEditor title="Szennyeződés (Állapot felár)" data={rug.conditions} onChange={d => setRug({...rug, conditions: d})} unit="Ft/m²" />
          <DictEditor title="Extrák (Opcionális felár)" data={rug.extras} onChange={d => setRug({...rug, extras: d})} unit="Ft/m²" />
          <DictEditor title="Anyagok (Felár)" data={rug.materials || {}} onChange={d => setRug({...rug, materials: d})} unit="Ft/m²" />
        </div>
      </div>
      {/* Upholstery Pricing */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-xl font-black text-[#1D63B7] mb-6 flex items-center gap-2">
          2. Kárpittisztítás Árak
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DictEditor title="Bútor Típusok (Alapár)" data={uph.types} onChange={d => setUph({...uph, types: d})} />
          <DictEditor title="Opcionális Extrák" data={uph.options} onChange={d => setUph({...uph, options: d})} />
        </div>
      </div>

      {/* Car Pricing */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-xl font-black text-[#1D63B7] mb-6 flex items-center gap-2">
          3. Autótisztítás Árak
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PackageEditor title="Tisztítási Csomagok (Alapár + Leírás)" data={car.packages} onChange={d => setCar({...car, packages: d})} />
          <DictEditor title="Autó Kategóriák (Méret felár)" data={car.categories} onChange={d => setCar({...car, categories: d})} />
          <DictEditor title="Kiegészítő Extrák" data={car.extras || {}} onChange={d => setCar({...car, extras: d})} />
        </div>
      </div>

    </div>
  );
}
