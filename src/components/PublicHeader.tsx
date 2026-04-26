import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from "@/components/MobileMenu";

export default function PublicHeader({ settings }: { settings: any }) {
  const companyLogo = settings?.company_logo || '/images/logo/rubicon-logo-fekvo.png';

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="relative h-10 w-48">
            <Image src={companyLogo} alt={settings?.company_name || 'RUBICON'} fill className="object-contain object-left" priority />
          </div>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/#velemenyek" className="font-semibold text-gray-600 hover:text-[#059669] transition-colors">Vélemények</Link>
          <Link href="/#rolunk" className="font-semibold text-gray-600 hover:text-[#059669] transition-colors">Rólunk</Link>
          <Link href="/#szolgaltatasok" className="font-semibold text-gray-600 hover:text-[#059669] transition-colors">Szolgáltatásaink</Link>
          <Link href="/#referenciak" className="font-semibold text-gray-600 hover:text-[#059669] transition-colors">Referenciák</Link>
          <Link href="/#arak" className="font-semibold text-gray-600 hover:text-[#059669] transition-colors">Árak</Link>
          <a href="/#kapcsolat" className="bg-[#064E3B] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#059669] transition-all transform hover:scale-105 shadow-md">
            Kapcsolat
          </a>
        </nav>
        
        <MobileMenu />
      </div>
    </header>
  );
}