"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden flex items-center">
      <button onClick={toggleMenu} className="text-[#181A2C] focus:outline-none p-2 relative z-50">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 transition-opacity"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeMenu}
        />
      )}

      {/* Side Menu */}
      <div 
        className={`fixed top-0 right-0 h-screen w-64 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex justify-end p-6 border-b border-gray-100 min-h-[72px]">
          <button onClick={closeMenu} className="text-gray-500 hover:text-[#181A2C]">
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col gap-6 p-8">
          <Link href="#velemenyek" onClick={closeMenu} className="text-xl font-semibold text-gray-800 hover:text-[#3AC2FE] transition-colors">Vélemények</Link>
          <Link href="#rolunk" onClick={closeMenu} className="text-xl font-semibold text-gray-800 hover:text-[#3AC2FE] transition-colors">Rólunk</Link>
          <Link href="#szolgaltatasok" onClick={closeMenu} className="text-xl font-semibold text-gray-800 hover:text-[#3AC2FE] transition-colors">Szolgáltatásaink</Link>
          <Link href="#referenciak" onClick={closeMenu} className="text-xl font-semibold text-gray-800 hover:text-[#3AC2FE] transition-colors">Referenciák</Link>
          <Link href="#arak" onClick={closeMenu} className="text-xl font-semibold text-gray-800 hover:text-[#3AC2FE] transition-colors">Árak</Link>
          <a href="#kapcsolat" onClick={closeMenu} className="bg-[#1D63B7] text-center text-white px-6 py-4 rounded-full font-bold hover:bg-[#3AC2FE] transition-all shadow-md mt-4">
            Ajánlatkérés
          </a>
        </div>
      </div>
    </div>
  );
}