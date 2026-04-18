'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/actions';
import { LayoutDashboard, Calculator, Settings, LogOut, Star, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/rubicon-gate-portal/login');
  };

  const navItems = [
    { name: 'Irányítópult', href: '/rubicon-gate-portal', icon: LayoutDashboard },
    { name: 'Kalkulátor (Új Munka)', href: '/rubicon-gate-portal/new', icon: Calculator },
    { name: 'Beállítások', href: '/rubicon-gate-portal/settings', icon: Settings },
    { name: 'Értékelések', href: '/rubicon-gate-portal/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#EDEDED] flex text-[#181A2C]">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#181A2C] text-white rounded-md shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:relative z-40 inset-y-0 left-0 w-64 bg-[#181A2C] text-[#EDEDED] transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#3AC2FE]">Rubicon Gate</h2>
          <p className="text-sm text-gray-400 mt-1">Adminportál</p>
        </div>
        <nav className="mt-6 flex flex-col space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1D63B7] text-white' : 'hover:bg-[#1D63B7]/50'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Kijelentkezés</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {/* Mobile Header Spacer */}
        <div className="h-16 lg:hidden bg-[#181A2C] w-full" />
        <main className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
