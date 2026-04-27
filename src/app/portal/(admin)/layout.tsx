'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Calculator, Settings, LogOut, Star, Menu, X, BarChart3, HelpCircle, FileText, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/portal/login' });
  };

  const navItems = [
    { name: 'Irányítópult', href: '/portal', icon: LayoutDashboard },
    { name: 'Kézi Munkafelvétel', href: '/portal/new', icon: Calculator },
    { name: 'Beállítások', href: '/portal/settings', icon: Settings },
    { name: 'Értékelések', href: '/portal/reviews', icon: Star },
    { name: 'Súgóközpont', href: '/portal/help', icon: HelpCircle },
    { name: 'Extra Funkciók', href: '/portal/extras', icon: Zap },
  ];

  const demoItems = [
    { name: 'Irányítópult (Auto)', href: '/portal/demo-dashboard', icon: LayoutDashboard },
    { name: 'Intelligens Ajánlatkérő', href: '/portal/demo-quote', icon: FileText },
    { name: 'Intelligens Kalkulátor', href: '/portal/demo-new', icon: Calculator },
    { name: 'Statisztika (SEO+AIO)', href: '/portal/statistics', icon: BarChart3 },
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
      <div className={`fixed lg:relative z-40 inset-y-0 left-0 w-64 bg-[#181A2C] text-[#EDEDED] transform transition-transform duration-300 ease-in-out flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 pt-16 lg:pt-6 shrink-0">
          <h2 className="text-2xl font-bold text-[#059669]">Rubicon Portál</h2>
          <p className="text-sm text-gray-400 mt-1">Adminportál</p>
        </div>
        <nav className="mt-2 flex-1 overflow-y-auto flex flex-col space-y-1 px-4 pb-6">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4 mt-2">Menü</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#064E3B] text-white' : 'hover:bg-[#064E3B]/50'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2 px-4 mt-8 border-t border-gray-700 pt-6">Prémium DEMO</div>
          {demoItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#059669]/20 text-[#059669]' : 'hover:bg-[#059669]/10 text-gray-300'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 w-full p-4 border-t border-gray-700 bg-[#181A2C]">
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
