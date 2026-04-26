"use client";

import { useState } from "react";
import { Sparkles, Sofa, CarFront, Check, Info, Plus } from "lucide-react";

interface PricingTableProps {
  pricingRug: any;
  pricingUph: any;
  pricingCar: any;
}

export default function PricingTable({ pricingRug, pricingUph, pricingCar }: PricingTableProps) {
  const [activeTab, setActiveTab] = useState<'rug' | 'uph' | 'car'>('rug');

  const formatPrice = (p: any) => {
    const num = Number(p);
    return isNaN(num) ? "0" : num.toLocaleString('hu-HU');
  };

  return (
    <div className="w-full text-left">
      {/* Tab Kapcsolók */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('rug')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${activeTab === 'rug' ? 'bg-[#059669] text-white scale-105 shadow-xl' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
        >
          <Sparkles size={20} /> Szőnyegtisztítás
        </button>
        <button
          onClick={() => setActiveTab('uph')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${activeTab === 'uph' ? 'bg-[#059669] text-white scale-105 shadow-xl' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
        >
          <Sofa size={20} /> Kárpittisztítás
        </button>
        <button
          onClick={() => setActiveTab('car')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${activeTab === 'car' ? 'bg-[#059669] text-white scale-105 shadow-xl' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
        >
          <CarFront size={20} /> Autókozmetika
        </button>
      </div>

      {/* --- SZŐNYEG TÁBLÁZAT --- */}
      {activeTab === 'rug' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Alapárak */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Check className="text-green-400" /> Alapárak (Vastagság szerint)
              </h4>
              <div className="space-y-4">
                {Object.entries(pricingRug?.types || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">{formatPrice(price)} Ft <span className="text-xs text-gray-400">/m²</span></span>
                  </div>
                ))}
              </div>
            </div>
            {/* Állapot felárak */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Info size={20} /> Szennyeződés felárak
              </h4>
              <div className="space-y-4">
                {Object.entries(pricingRug?.conditions || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">+{formatPrice(price)} Ft <span className="text-xs text-gray-400">/m²</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Anyag felárak */}
             <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Sparkles size={20} /> Speciális Anyagok
              </h4>
              <div className="space-y-4">
                {Object.entries(pricingRug?.materials || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">+{formatPrice(price)} Ft <span className="text-xs text-gray-400">/m²</span></span>
                  </div>
                ))}
              </div>
            </div>
            {/* Extrák */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Plus size={20} /> Opcionális Extrák
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(pricingRug?.extras || {}).map(([name, price]) => (
                  <div key={name} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col">
                    <span className="text-sm text-gray-400 mb-1">{name}</span>
                    <span className="text-lg font-black text-white">+{formatPrice(price)} Ft <span className="text-xs">/m²</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KÁRPIT TÁBLÁZAT --- */}
      {activeTab === 'uph' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Sofa size={20} /> Bútortípusok Árai
              </h4>
              <div className="space-y-4">
                {Object.entries(pricingUph?.types || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">{formatPrice(price)} Ft <span className="text-xs text-gray-400">/db-tól</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Plus size={20} /> Választható Extrák
              </h4>
              <div className="space-y-4">
                {Object.entries(pricingUph?.options || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">+{formatPrice(price)} Ft</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTÓ TÁBLÁZAT --- */}
      {activeTab === 'car' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Csomagok */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(pricingCar?.packages || {}).map(([name, data]: [string, any]) => {
              const p = typeof data === 'object' ? data : { price: data, description: '', services: '' };
              const serviceList = p.services ? p.services.split(',').map((s: string) => s.trim()) : [];
              
              return (
                <div key={name} className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col relative overflow-hidden group hover:border-[#059669]/50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CarFront size={80} />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2">{name}</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[40px]">{p.description}</p>
                  
                  <div className="text-3xl font-black text-[#059669] mb-8">
                    {formatPrice(p.price)} Ft
                    <span className="text-xs text-gray-500 block font-normal mt-1 text-white/60">* Kis kategóriás autókra</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {serviceList.map((s: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check size={16} className="text-[#059669] mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Méret felárak */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6">Gépjármű Kategória felárak</h4>
              <div className="space-y-4">
                {Object.entries(pricingCar?.categories || {}).map(([name, price]) => (
                  <div key={name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-lg font-medium text-left">{name}</span>
                    <span className="text-xl font-black text-white text-right">+{formatPrice(price)} Ft</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Autó extrák */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h4 className="text-xl font-bold text-[#059669] mb-6">Kiegészítő Extrák</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(pricingCar?.extras || {}).map(([name, price]) => (
                  <div key={name} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col">
                    <span className="text-sm text-gray-400 mb-1">{name}</span>
                    <span className="text-lg font-black text-white">+{formatPrice(price)} Ft</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
