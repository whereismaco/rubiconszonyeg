'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col xl:flex-row items-center justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
        <div className="p-3 bg-white/20 rounded-full shrink-0">
          <Clock size={32} className="animate-pulse" />
        </div>
        <div>
          <h3 className="font-black text-xl md:text-2xl">Árgarancia Ajánlat!</h3>
          <p className="text-red-100 font-medium">A lent látható fejlesztési árakat legkésőbb 2026. május 31-ig tudom garantálni neked.</p>
        </div>
      </div>
      
      <div className="flex gap-2 sm:gap-3 text-center shrink-0">
        <div className="bg-black/20 rounded-xl p-3 min-w-[65px] sm:min-w-[70px]">
          <div className="text-2xl sm:text-3xl font-black">{timeLeft.days}</div>
          <div className="text-[10px] sm:text-xs uppercase font-bold text-red-200">Nap</div>
        </div>
        <div className="bg-black/20 rounded-xl p-3 min-w-[65px] sm:min-w-[70px]">
          <div className="text-2xl sm:text-3xl font-black">{timeLeft.hours}</div>
          <div className="text-[10px] sm:text-xs uppercase font-bold text-red-200">Óra</div>
        </div>
        <div className="bg-black/20 rounded-xl p-3 min-w-[65px] sm:min-w-[70px]">
          <div className="text-2xl sm:text-3xl font-black">{timeLeft.minutes}</div>
          <div className="text-[10px] sm:text-xs uppercase font-bold text-red-200">Perc</div>
        </div>
        <div className="bg-black/20 rounded-xl p-3 min-w-[65px] sm:min-w-[70px]">
          <div className="text-2xl sm:text-3xl font-black">{timeLeft.seconds}</div>
          <div className="text-[10px] sm:text-xs uppercase font-bold text-red-200">Mp</div>
        </div>
      </div>
    </div>
  );
}
