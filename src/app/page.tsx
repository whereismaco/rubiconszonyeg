import { getSettings, createJob } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Shield, Star, Droplets, Wind, Sparkles } from 'lucide-react';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `${settings.company_name} | ${settings.hero_title || 'Prémium Tisztítás'}`,
    description: settings.hero_subtitle || 'Szőnyeg, kárpit és autótisztítás professzionális eszközökkel.',
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  async function handleContact(formData: FormData) {
    'use server';
    await createJob({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      notes: `Telefonos elérhetőség: ${formData.get('phone')} | ${formData.get('message')}`,
      items: [],
      total: 0
    });
    redirect('/?success=1#kapcsolat');
  }

  // Fallbacks for content if not set in DB yet
  const heroTitle = settings.hero_title || 'Adja vissza otthona tisztaságát és frissességét – professzionális szőnyegtisztítás, kényelmesen.';
  const heroSubtitle = settings.hero_subtitle || 'Mi elszállítjuk, újjávarázsoljuk, és tisztán hozzuk vissza. Érd és környéke legmagasabbra értékelt tisztítója, 76 elégedett ügyfél igazolt véleményével.';
  const bullet1 = settings.hero_bullet_1 || 'Háztól-házig szállítás (Önnek ki sem kell mozdulnia).';
  const bullet2 = settings.hero_bullet_2 || '4.6 csillagos Google értékelés.';
  const bullet3 = settings.hero_bullet_3 || 'Professzionális, mélymosásos technológia.';
  
  const aboutTitle = settings.about_title || 'A porszívózás nem elég a valódi tisztasághoz.';
  const aboutText = settings.about_text || 'A szőnyegek mélyén megbújó atkák, pollenek és makacs szennyeződések nemcsak az esztétikát rombolják, hanem az egészségre is hatással vannak. Hartmann Zoltán vagyok, a Rubicon alapítója. Tudom, hogy Önnek az otthona nyugalma a legfontosabb. Ezért fejlesztettük ki azt a többlépcsős tisztítási folyamatot, amely nemcsak a látható foltokat távolítja el, hanem a textília legmélyebb rétegeit is fertőtleníti.';
  
  const srv1Title = settings.service_1_title || 'Szőnyeg-Újjáélesztés';
  const srv1Text = settings.service_1_text || 'Nem csupán mosás. Mélyrétegű extrakció, amely eltávolítja a port, az atkákat és a kellemetlen szagokat. Szőnyege újra olyan lesz, mint aznap, amikor megvásárolta.';
  const srv2Title = settings.service_2_title || 'Prémium Kárpittisztítás';
  const srv2Text = settings.service_2_text || 'Kanapék, fotelek és matracok professzionális kezelése. Eltávolítjuk a foltokat és a baktériumokat, hogy családja biztonságban pihenhessen.';
  const srv3Title = settings.service_3_title || 'Ózonos Fertőtlenítés';
  const srv3Text = settings.service_3_text || 'A legmodernebb megoldás a szagok és kórokozók ellen. Vegyszermentes, gyors és kíméletlen a baktériumokkal szemben.';

  const pricingTitle = settings.pricing_title || 'Világos árak, meglepetések nélkül.';
  const pricingBody = settings.pricing_body || 'Nálunk nincs "rejtett költség". Minden megrendelés előtt pontos elszámolást kap.';
  const pricingExtra = settings.pricing_extra || '15 m² felett a kiszállítás és visszaszállítás költségét mi álljuk!';

  const pricingRug = settings.pricing_rug || { types: {} };
  const pricingUph = settings.pricing_upholstery || { types: {} };


  // Reviews mock (later from Google API)
  const reviews = [
    { name: "Kovács Anna", text: "Gyönyörűen kitisztították a szőnyegemet, mintha új lenne! A szállítás is pontos volt, csak ajánlani tudom őket.", stars: 5 },
    { name: "Nagy Péter", text: "A kávéfoltot teljesen eltüntették a kanapénkról. Profi csapat, végtelenül udvarias kommunikációval.", stars: 5 },
    { name: "Szabó Éva", text: "Nagyon alapos, tiszta munkát végeztek. Az ózonos tisztítás után hetekig friss illat volt az autóban.", stars: 5 }
  ];

  return (
    <div className="min-h-screen bg-[#EDEDED] text-[#181A2C] font-sans selection:bg-[#3AC2FE] selection:text-white">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-[#1D63B7] tracking-tight">{settings.company_name || 'Rubicon'}</h1>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#szolgaltatasok" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Szolgáltatások</Link>
            <Link href="#arak" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Árak</Link>
            <Link href="#velemenyek" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Vélemények</Link>
            <a href="#kapcsolat" className="bg-[#1D63B7] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#3AC2FE] transition-all transform hover:scale-105 shadow-md">
              Ingyenes Ajánlatkérés
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden flex items-center min-h-[90vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/hero_bg_1776259398087.png" alt="Szőnyegtisztítás folyamat" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-[#181A2C]/80 bg-gradient-to-r from-[#181A2C] to-[#181A2C]/60" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[#3AC2FE]/20 text-[#3AC2FE] font-bold text-sm tracking-widest uppercase mb-6 border border-[#3AC2FE]/30">Prémium Tisztító Szolgáltatás</span>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                {heroTitle}
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 leading-relaxed">
                {heroSubtitle}
              </p>
              
              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="text-[#3AC2FE]" />
                  <span className="text-lg font-medium">{bullet1}</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Star className="text-[#FEC500]" fill="#FEC500" />
                  <span className="text-lg font-medium">{bullet2}</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Shield className="text-[#3AC2FE]" />
                  <span className="text-lg font-medium">{bullet3}</span>
                </div>
              </div>

              <a href="#kapcsolat" className="inline-block bg-[#3AC2FE] hover:bg-white hover:text-[#1D63B7] text-white font-bold text-xl px-10 py-5 rounded-full transition-all shadow-[0_0_40px_rgba(58,194,254,0.4)] hover:shadow-xl">
                Kérem a tiszta szőnyeget
              </a>
            </div>
          </div>
        </section>

        {/* Problem & Solution (About) */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/about_image_1776259413742.png" alt="Mélytisztítás hatása" fill className="object-cover" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"></div>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#181A2C] mb-8 leading-tight">{aboutTitle}</h3>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                {aboutText}
              </p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-500 font-medium">
                <div className="w-12 h-12 bg-[#1D63B7] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">HZ</div>
                 Biztonságos és vegyszermentes megoldások az Ön és családja egészségéért.
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="szolgaltatasok" className="py-32 bg-[#EDEDED] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h3 className="text-4xl md:text-5xl font-bold text-[#1D63B7] mb-6">Értékünk a részletekben rejlik</h3>
              <p className="text-xl text-gray-600">Olyan szolgáltatásokat nyújtunk, amelyek meghosszabbítják bútorai élettartamát és frissességet hoznak otthonába.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Service 1 */}
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
              
              {/* Service 2 */}
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

              {/* Service 3 */}
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

        {/* Pricing */}
        <section id="arak" className="py-24 bg-[#181A2C] text-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{pricingTitle}</h3>
            <p className="text-xl text-gray-300 font-light mb-16 max-w-2xl mx-auto">{pricingBody}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-8 rounded-2xl border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <h5 className="font-bold text-xl text-[#3AC2FE] mb-2">Normál szőnyegtisztítás</h5>
                <p className="text-3xl font-black text-white">{(pricingRug.types?.['Vékony'] || 2100).toLocaleString('hu-HU')} Ft<span className="text-lg font-medium text-gray-400">/m²-től</span></p>
              </div>
              <div className="p-8 rounded-2xl border border-[#3AC2FE] bg-[#3AC2FE]/10 relative transform md:-translate-y-4 shadow-2xl shadow-[#3AC2FE]/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3AC2FE] text-white text-sm font-bold uppercase tracking-wider py-1 px-4 rounded-full">Legnépszerűbb</div>
                <h5 className="font-bold text-xl text-white mb-2">Vastag/Shaggy/Prémium</h5>
                <p className="text-3xl font-black text-white">{(pricingRug.types?.['Vastag'] || 2600).toLocaleString('hu-HU')} Ft<span className="text-lg font-medium text-blue-200">/m²-től</span></p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <h5 className="font-bold text-xl text-[#3AC2FE] mb-2">Matrac tisztítás (mindkét oldal)</h5>
                <p className="text-3xl font-black text-white">{(pricingUph.types?.['Matrac (90x200)'] || 12000).toLocaleString('hu-HU')} Ft<span className="text-lg font-medium text-gray-400">-tól</span></p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-[#FEC500]/20 text-[#FEC500] px-6 py-3 rounded-full font-bold text-lg">
              <Sparkles size={20} />
              {pricingExtra}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section id="velemenyek" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-[#1D63B7] mb-16">Akik már minket választottak</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev, i) => (
                <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 text-left shadow-sm">
                  <div className="flex text-[#FEC500] mb-4">
                    {[...Array(rev.stars)].map((_, idx) => <Star key={idx} fill="#FEC500" size={20} />)}
                  </div>
                  <p className="text-lg text-gray-700 font-medium mb-6 italic">"{rev.text}"</p>
                  <p className="font-bold text-[#181A2C]">{rev.name}</p>
                  <p className="text-sm text-gray-400">Igazolt Google Értékelés</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form CTA */}
        <section id="kapcsolat" className="py-24 bg-[#3AC2FE] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-black text-[#181A2C] mb-4">Kérjen ajánlatot most, és szabaduljon meg a takarítás gondjától!</h3>
                <p className="text-lg text-gray-600 font-light">Töltse ki az űrlapot, és munkatársunk 24 órán belül felveszi Önnel a kapcsolatot az időpont egyeztetése miatt.</p>
              </div>

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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pontos Cím (Irányítószám, Város, Utca)</label>
                  <input type="text" name="address" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="2030 Érd, Fő utca 12." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Milyen tisztításra lenne szükség?</label>
                  <textarea name="message" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3AC2FE] focus:bg-white transition-all" placeholder="Két vastag szőnyeg és egy ülőgarnitúra..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#181A2C] hover:bg-[#1D63B7] text-white font-bold text-xl py-5 rounded-2xl transition-all elevate-hover shadow-[0_20px_40px_rgba(24,26,44,0.3)]">
                  Kérem a tiszta szőnyeget – Ajánlatküldés
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#181A2C] py-16 text-center text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
          <div>
            <h4 className="text-white font-bold text-xl mb-4">{settings.company_name}</h4>
            <p className="font-light text-gray-400 mb-2">Professzionális tisztítás Érden és környékén.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xl mb-4">Elérhetőségek</h4>
            <p className="font-light text-gray-400">Telefon: {settings.contact_phone || '+36 30 123 4567'}</p>
            <p className="font-light text-gray-400">Email: {settings.contact_email || 'info@rubicon.hu'}</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xl mb-4">Navigáció</h4>
            <ul className="space-y-2">
              <li><Link href="#szolgaltatasok" className="hover:text-white transition-colors">Szolgáltatások</Link></li>
              <li><Link href="#arak" className="hover:text-white transition-colors">Árak</Link></li>
              <li><Link href="/rubicon-gate-portal" className="hover:text-white transition-colors text-gray-600">Admin Portál</Link></li>
            </ul>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} {settings.company_name}. Minden jog fenntartva.</p>
        <p className="mt-2 text-xs opacity-50">Powered by MacoLabs & Rubicon Engine v2</p>
      </footer>
    </div>
  );
}
