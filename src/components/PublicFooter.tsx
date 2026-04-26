import Link from 'next/link';

export default function PublicFooter({ settings }: { settings: any }) {
  const contactPhone = settings?.contact_phone || '+36 30 350 6109';
  const contactEmail = settings?.contact_email || 'info@rubiconszonyeg.hu';

  return (
    <footer className="bg-[#022C22] py-16 text-center text-gray-400 border-t border-[#064E3B]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
        <div>
          <h4 className="text-white font-bold text-xl mb-4">{settings?.company_name || 'RUBICON'}</h4>
          <p className="font-light text-gray-400 mb-2">Professzionális tisztítás Érden és környékén.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-xl mb-4">Elérhetőségek</h4>
          <p className="font-light text-gray-400">Telefon: {contactPhone}</p>
          <p className="font-light text-gray-400">Email: {contactEmail}</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-xl mb-4">Navigáció</h4>
          <ul className="space-y-2">
            <li><Link href="/#velemenyek" className="hover:text-white transition-colors">Vélemények</Link></li>
            <li><Link href="/#rolunk" className="hover:text-white transition-colors">Rólunk</Link></li>
            <li><Link href="/#szolgaltatasok" className="hover:text-white transition-colors">Szolgáltatásaink</Link></li>
            <li><Link href="/#referenciak" className="hover:text-white transition-colors">Referenciák</Link></li>
            <li><Link href="/#arak" className="hover:text-white transition-colors">Árak</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p>&copy; {new Date().getFullYear()} {settings?.company_name || 'Rubicon Szőnyegtisztítás'}. Minden jog fenntartva.</p>
          <p className="mt-2 text-xs opacity-50">Powered by MacoLabs & Rubicon Engine v2</p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/aszf" className="hover:text-white transition-colors">Általános Szerződési Feltételek (ÁSZF)</Link>
          <span className="opacity-50">|</span>
          <Link href="/adatvedelem" className="hover:text-white transition-colors">Adatvédelmi Nyilatkozat</Link>
        </div>
      </div>
    </footer>
  );
}