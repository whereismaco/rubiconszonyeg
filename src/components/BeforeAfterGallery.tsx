"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";

const pairs = [
  { 
    id: 1, 
    name: "Klasszikus Magyar", 
    before: "/images/elotte-utana/klasszikus_magyar_szonyeg_elotte.webp", 
    after: "/images/elotte-utana/klasszikus_magyar_szonyeg_utana.webp" 
  },
  { 
    id: 2, 
    name: "Klasszikus Zöld", 
    before: "/images/elotte-utana/klasszikus_zold_szonyeg_elotte.webp", 
    after: "/images/elotte-utana/klasszikus_zold_szonyeg_utana.webp" 
  },
  { 
    id: 3, 
    name: "Macskás", 
    before: "/images/elotte-utana/macskas_szonyeg_elotte.webp", 
    after: "/images/elotte-utana/macskas_szonyeg_utana.webp" 
  },
  { 
    id: 4, 
    name: "Madaras Színes", 
    before: "/images/elotte-utana/madaras_szines_szonyeg_elotte.webp", 
    after: "/images/elotte-utana/madaras_szines_szonyeg_utana.webp" 
  },
  { 
    id: 5, 
    name: "Piros", 
    before: "/images/elotte-utana/piros_szonyeg_elotte.webp", 
    after: "/images/elotte-utana/piros_szonyeg_utana.webp" 
  }
];

export default function BeforeAfterGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePair = pairs[activeIndex];

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Only drag if mouse is down or we just want hover to control it? Usually hover or drag.
    // Let's do drag/click
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleInteractionStart = (clientX: number) => {
    handleMove(clientX);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Main Before-After Viewer */}
      <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gray-100 select-none group">
        <div 
          ref={containerRef}
          className="absolute inset-0 w-full h-full cursor-ew-resize"
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => handleInteractionStart(e.clientX)}
          onTouchMove={handleTouchMove}
          onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
        >
          {/* After Image (Base) */}
          <Image 
            src={activePair.after} 
            alt={`Utána - ${activePair.name}`} 
            fill 
            className="object-cover pointer-events-none" 
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
          <div className="absolute top-4 right-4 bg-white/90 text-[#181A2C] px-3 py-1 text-sm font-bold rounded-lg shadow-sm">
            Utána
          </div>

          {/* Before Image (Clipped overlay) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image 
              src={activePair.before} 
              alt={`Előtte - ${activePair.name}`} 
              fill 
              className="object-cover pointer-events-none" 
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <div className="absolute top-4 left-4 bg-[#181A2C]/90 text-white px-3 py-1 text-sm font-bold rounded-lg shadow-sm">
              Előtte
            </div>
          </div>

          {/* Slider Line & Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
              <div className="flex gap-1">
                <div className="w-0.5 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-0.5 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-4 overflow-x-auto pb-4 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
        {pairs.map((pair, idx) => (
          <button
            key={pair.id}
            onClick={() => {
              setActiveIndex(idx);
              setSliderPosition(50); // Reset slider position when changing image
            }}
            className={`relative shrink-0 snap-center w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-[3px] transition-all duration-300 ${activeIndex === idx ? 'border-[#059669] scale-105 shadow-xl' : 'border-transparent shadow-sm hover:border-gray-300 opacity-70 hover:opacity-100'}`}
          >
            <Image 
              src={pair.after} 
              alt={pair.name} 
              fill 
              className="object-cover" 
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}