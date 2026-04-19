import { getSettings, createJob } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Droplets, Wind, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import GoogleReviews from "@/components/GoogleReviews";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `${settings.company_name || 'Rubicon Szőnyegtisztítás'} | ${settings.hero_title || 'Érd legmegbízhatóbb szőnyegtisztítója'}`,
    description: settings.hero_subtitle || 'Ne kockáztasson amatőrökkel. Mi elszállítjuk, professzionális technológiával újjávarázsoljuk, és tisztán hozzuk vissza otthonába szőnyegeit és kárpitjait.',
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  async function handleContact(formData: FormData) {
    'use server';
    await createJob({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      notes: `Telefonos elérhetőség: ${formData.get('phone')}\nSzolgáltatás: ${formData.get('service_type')}\nMegjegyzés (Méret/Darab): ${formData.get('message')}`,
      items: [],
      total: 0
    });
    redirect('/?success=1#kapcsolat');
  }

  // --- 1. HERO SZEKCIÓ ---
  const heroBadge = settings.hero_badge || 'Kiválóra Értékelt Szolgáltatás';
  const heroTitle = settings.hero_title || 'Érd legmegbízhatóbb szőnyegtisztítója';
  const heroSubtitle = settings.hero_subtitle || '4,6 csillagos minőség, amiben már 76 család megbízott.';
  const heroParagraph = settings.hero_paragraph || 'Ne kockáztasson amatőrökkel. Mi elszállítjuk, professzionális technológiával újjávarázsoljuk, és tisztán hozzuk vissza otthonába szőnyegeit és kárpitjait.';
  const bullet1 = settings.hero_bullet_1 || 'Igazolt minőség: 76 valódi ügyfél véleménye alapján.';
  const bullet2 = settings.hero_bullet_2 || 'Teljes kényelem: Ingyenes háztól-házig szállítás (15 m² felett).';
  const bullet3 = settings.hero_bullet_3 || 'Mélytisztítás: Eltávolítjuk a port, az atkákat és a makacs foltokat is.';
  const heroCta = settings.hero_cta || 'Ingyenes Ajánlatkérés';
  const heroBgImage = settings.hero_bg_image || '/images/rubicon_szonyegtisztitas_hero_img.webp';
  
  // --- 2. ÉRTÉKELÉSEK SZEKCIÓ ---
  const reviewsTitle = settings.reviews_title || 'Ügyfeleink véleménye a Rubiconról';
  const reviewsSubtitle = settings.reviews_subtitle || 'Nem csupán ígérjük a minőséget – ügyfeleink visszajelzései a garanciánk a kiváló munkára.';

  // --- 3. RÓLUNK SZEKCIÓ ---
  const aboutTitle = settings.about_title || 'A porszívózás nem elég a valódi tisztasághoz.';
  const aboutText = settings.about_text || 'Hartmann Zoltán vagyok, a Rubicon alapítója. Tudom, hogy Önnek az otthona nyugalma és egészsége a legfontosabb. A szőnyegek mélyén megbújó atkák, pollenek és makacs szennyeződések azonban nemcsak az esztétikát rontják, hanem hosszú távon az allergének forrásai is lehetnek.\n\nEzért fejlesztettük ki azt a többlépcsős tisztítási folyamatot, amely messze túlmutat a hagyományos megoldásokon. Nem csupán a látható foltokat távolítjuk el, hanem a textília legmélyebb rétegeit is fertőtlenítjük és felfrissítjük. Professzionális technológiánkkal garantáljuk, hogy szőnyegei és kárpitjai visszanyerik eredeti állapotukat, Önnek pedig csak a végeredményt kell élveznie.';
  
  // --- 4. SZOLGÁLTATÁSOK SZEKCIÓ ---
  const servicesTitle = settings.services_title || 'Szolgáltatásaink az Ön kényelméért';
  const srv1Title = settings.service_1_title || 'Szőnyeg-Újjáélesztés';
  const srv1Text = settings.service_1_text || 'Nem csupán mosás. Mélyrétegű extrakciót alkalmazunk, amely eltávolítja a mélyen ülő port, az atkákat és a kellemetlen szagokat. Szőnyege újra olyan lesz, mint aznap, amikor megvásárolta.';
  const srv2Title = settings.service_2_title || 'Prémium Kárpittisztítás';
  const srv2Text = settings.service_2_text || 'Kanapék, fotelek és matracok professzionális kezelése. Eltávolítjuk a foltokat és a baktériumokat, hogy családja biztonságban pihenhessen. Matractisztításunk során a teljes mélységű higiéniára fókuszálunk.';
  const srv3Title = settings.service_3_title || 'Ózonos Fertőtlenítés';
  const srv3Text = settings.service_3_text || 'A legmodernebb megoldás a szagok és kórokozók ellen. Vegyszermentes, gyors és kíméletlen a baktériumokkal, penésszel és vírusokkal szemben. Ideális választás kisgyermekes családoknak és kisállattartóknak.';

  // --- 5. ÁRAK SZEKCIÓ ---
  const pricingTitle = settings.pricing_title || 'Átlátható árak, rejtett költségek nélkül';
  const pricingBody = settings.pricing_body || 'Nálunk nincs meglepetés a munka végén. Minden megrendelés előtt pontos elszámolást kap.';
  const pricingExtra = settings.pricing_extra || '15 m² feletti megrendelés esetén a kiszállítás és visszaszállítás költségét mi álljuk Érd és környékén!';

  const pricingRug = settings.pricing_rug || { types: {} };
  const pricingUph = settings.pricing_upholstery || { types: {} };

  // --- 6. KAPCSOLAT SZEKCIÓ ---
  const contactTitle = settings.contact_title || 'Kérjen ajánlatot most, és szabaduljon meg a takarítás gondjától!';
  const contactSubtitle = settings.contact_subtitle || 'Töltse ki az alábbi mezőket, és 24 órán belül felvesszük Önnel a kapcsolatot az időpont egyeztetése miatt.';
  const contactCta = settings.contact_cta || 'Kérem a tiszta szőnyeget – Ajánlatküldés';

  const contactAddress = settings.contact_address || '2030 Érd, Bajcsy Zsilinszky út 23.';
  const contactPhone = settings.contact_phone || '+36 30 350 6109';
  const contactEmail = settings.contact_email || 'info@rubiconszonyeg.hu';

  const companyLogo = settings.company_logo || '/images/logo/rubicon-logo-fekvo.png';

  return (
    <div className="min-h-screen bg-[#EDEDED] text-[#181A2C] font-sans selection:bg-[#3AC2FE] selection:text-white scroll-smooth">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="relative h-10 w-48">
              <Image src={companyLogo} alt={settings.company_name || 'RUBICON'} fill className="object-contain object-left" priority />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#szolgaltatasok" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Szolgáltatások</Link>
            <Link href="#arak" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Árak</Link>
            <Link href="#velemenyek" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Vélemények</Link>
            <a href="#kapcsolat" className="bg-[#1D63B7] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#3AC2FE] transition-all transform hover:scale-105 shadow-md">
              {heroCta}
            </a>
          </nav>
        </div>
      </header>

      <main className="bg-[#F8F9FA]">
        {/* 1. HERO Section */}
        <section className="relative pt-20 pb-32 overflow-hidden flex items-center min-h-[90vh]">
          <div className="absolute inset-0 z-0">
            <Image src={heroBgImage} alt="Szőnyegtisztítás" fill className="object-cover" priority />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[#3AC2FE]/20 text-[#3AC2FE] font-bold text-sm tracking-widest uppercase mb-6 border border-[#3AC2FE]/30">{heroBadge}</span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                {heroTitle}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {heroSubtitle}
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 leading-relaxed">
                {heroParagraph}
              </p>              
              <a href="#kapcsolat" className="inline-block bg-[#3AC2FE] hover:bg-white hover:text-[#1D63B7] text-white font-bold text-xl px-10 py-5 rounded-full transition-all shadow-[0_0_40px_rgba(58,194,254,0.4)] hover:shadow-xl mt-8">
                {heroCta}
              </a>
            </div>
          </div>
        </section>

        {/* 1.5. FŐ ÉRVEK SZEKCIÓ */}
        <section className="bg-[#F8F9FA] py-12 relative z-20 -mt-16 mx-6 rounded-3xl shadow-xl max-w-7xl lg:mx-auto border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            <div className="flex items-center gap-4 text-[#181A2C]">
              <div className="bg-[#1D63B7]/10 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="text-[#1D63B7] w-8 h-8" />
              </div>
              <span className="text-lg font-bold leading-tight">{bullet1}</span>
            </div>
            <div className="flex items-center gap-4 text-[#181A2C]">
              <div className="bg-[#1D63B7]/10 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="text-[#1D63B7] w-8 h-8" />
              </div>
              <span className="text-lg font-bold leading-tight">{bullet2}</span>
            </div>
            <div className="flex items-center gap-4 text-[#181A2C]">
              <div className="bg-[#1D63B7]/10 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="text-[#1D63B7] w-8 h-8" />
              </div>
              <span className="text-lg font-bold leading-tight">{bullet3}</span>
            </div>
          </div>
        </section>

        {/* 2. ÉRTÉKELÉSEK SZEKCIÓ */}
        <div id="velemenyek">
          <GoogleReviews title={reviewsTitle} subtitle={reviewsSubtitle} />
        </div>

        {/* 3. RÓLUNK SZEKCIÓ */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/about_image_1776259413742.png" alt="Mélytisztítás hatása" fill className="object-cover" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"></div>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#181A2C] mb-8 leading-tight">{aboutTitle}</h3>
              <div className="text-xl text-gray-600 font-light leading-relaxed mb-8 whitespace-pre-wrap">
                {aboutText}
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-500 font-medium">
                <div className="w-12 h-12 bg-[#1D63B7] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">HZ</div>
                 Biztonságos és vegyszermentes megoldások az Ön és családja egészségéért.
              </div>
            </div>
          </div>
        </section>

        {/* 4. SZOLGÁLTATÁSOK SZEKCIÓ */}
        <section id="szolgaltatasok" className="py-32 bg-[#EDEDED] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h3 className="text-4xl md:text-5xl font-bold text-[#1D63B7] mb-6">{servicesTitle}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src="/images/service_rug_1776259429432.png" alt={srv1Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-[#1D63B7]/10 text-[#1D63B7] rounded-2xl mb-6 flex items-center justify-center">
                    <Droplets size={28} />
                  </div>
                  <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{srv1Title}</h4>
                  <p className="text-gray-600 leading-relaxed font-light">{srv1Text}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src="/images/service_uph_1776259445038.png" alt={srv2Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-[#3AC2FE]/10 text-[#3AC2FE] rounded-2xl mb-6 flex items-center justify-center">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{srv2Title}</h4>
                  <p className="text-gray-600 leading-relaxed font-light">{srv2Text}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src="/images/service_ozone_1776259461131.png" alt={srv3Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-[#181A2C]/10 text-[#181A2C] rounded-2xl mb-6 flex items-center justify-center">
                    <Wind size={28} />
                  </div>
                  <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{srv3Title}</h4>
                  <p className="text-gray-600 leading-relaxed font-light">{srv3Text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ÁRAK SZEKCIÓ */}
        <section id="arak" className="py-24 bg-[#181A2C] text-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{pricingTitle}</h3>
            <p className="text-xl text-gray-300 font-light mb-16 max-w-2xl mx-auto">{pricingBody}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 rounded-2xl border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <h5 className="font-bold text-lg text-[#3AC2FE] mb-2">Normál szőnyegtisztítás</h5>
                <p className="text-2xl font-black text-white">{(pricingRug.types?.['Vékony'] || 2100).toLocaleString('hu-HU')} Ft<span className="text-sm font-medium text-gray-400"> /m²-től</span></p>
              </div>
              <div className="p-6 rounded-2xl border border-[#3AC2FE] bg-[#3AC2FE]/10 relative transform lg:-translate-y-4 shadow-2xl shadow-[#3AC2FE]/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3AC2FE] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Prémium</div>
                <h5 className="font-bold text-lg text-white mb-2">Vastag / Shaggy</h5>
                <p className="text-2xl font-black text-white">{(pricingRug.types?.['Vastag'] || 2600).toLocaleString('hu-HU')} Ft<span className="text-sm font-medium text-blue-200"> /m²-től</span></p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <h5 className="font-bold text-lg text-[#3AC2FE] mb-2">Matrac tisztítás</h5>
                <p className="text-2xl font-black text-white">{(pricingUph.types?.['Matrac (90x200)'] || 12000).toLocaleString('hu-HU')} Ft<span className="text-sm font-medium text-gray-400">-tól</span></p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <h5 className="font-bold text-lg text-[#3AC2FE] mb-2">Fotel tisztítása</h5>
                <p className="text-2xl font-black text-white">{(pricingUph.types?.['Fotel'] || 6000).toLocaleString('hu-HU')} Ft<span className="text-sm font-medium text-gray-400"> /db-tól</span></p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-[#FEC500]/20 text-[#FEC500] px-6 py-3 rounded-full font-bold text-lg">
              <Sparkles size={20} />
              {pricingExtra}
            </div>
          </div>
        </section>

        {/* 6. KAPCSOLAT SZEKCIÓ */}
        <section id="kapcsolat" className="py-24 bg-[#3AC2FE] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            <div className="lg:col-span-2 text-white">
              <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{contactTitle}</h3>
              <p className="text-xl font-medium opacity-90 mb-10">{contactSubtitle}</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-[#1D63B7]/20 p-4 rounded-2xl border border-white/10">
                  <div className="bg-white/20 p-3 rounded-full"><MapPin size={24} /></div>
                  <span className="text-lg font-medium">{contactAddress}</span>
                </div>
                <div className="flex items-center gap-4 bg-[#1D63B7]/20 p-4 rounded-2xl border border-white/10">
                  <div className="bg-white/20 p-3 rounded-full"><Phone size={24} /></div>
                  <span className="text-lg font-medium">{contactPhone}</span>
                </div>
                <div className="flex items-center gap-4 bg-[#1D63B7]/20 p-4 rounded-2xl border border-white/10">
                  <div className="bg-white/20 p-3 rounded-full"><Mail size={24} /></div>
                  <span className="text-lg font-medium">{contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl">
              <form action={handleContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teljes Név</label>
                    <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="Példa János" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefonszám</label>
                    <input type="tel" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="+36 30 123 4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Település és utca</label>
                  <input type="text" name="address" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="2030 Érd, Fő utca 12." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Szolgáltatás típusa</label>
                  <select name="service_type" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all">
                    <option value="Szőnyegtisztítás">Szőnyegtisztítás</option>
                    <option value="Kárpittisztítás">Kárpittisztítás</option>
                    <option value="Ózonos Fertőtlenítés">Ózonos Fertőtlenítés</option>
                    <option value="Több szolgáltatás is">Több szolgáltatás is</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Becsült méret vagy darabszám (Opcionális)</label>
                  <textarea name="message" rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="Pl: 2 darab közepes szőnyeg..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#181A2C] hover:bg-[#1D63B7] text-white font-bold text-xl py-5 rounded-2xl transition-all shadow-[0_20px_40px_rgba(24,26,44,0.3)] hover:shadow-[0_20px_40px_rgba(29,99,183,0.4)]">
                  {contactCta}
                </button>
              </form>
            </div>

          </div>
        </section>
      </main>

      <footer className="bg-[#181A2C] py-16 text-center text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
          <div>
            <h4 className="text-white font-bold text-xl mb-4">{settings.company_name || 'RUBICON'}</h4>
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
              <li><Link href="#szolgaltatasok" className="hover:text-white transition-colors">Szolgáltatások</Link></li>
              <li><Link href="#arak" className="hover:text-white transition-colors">Árak</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors text-gray-600">Admin Portál</Link></li>
            </ul>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} {settings.company_name || 'Rubicon Szőnyegtisztítás'}. Minden jog fenntartva.</p>
        <p className="mt-2 text-xs opacity-50">Powered by MacoLabs & Rubicon Engine v2</p>
      </footer>
    </div>
  );
}
