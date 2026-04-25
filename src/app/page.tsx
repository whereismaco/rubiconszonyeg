import { getSettings, createJob } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Sparkles, MapPin, Phone, Mail, Sofa, CarFront } from 'lucide-react';
import GoogleReviews from "@/components/GoogleReviews";
import VideosCarousel from "@/components/VideosCarousel";
import QuoteForm from "@/components/QuoteForm";
import PricingTable from "@/components/PricingTable";
import MobileMenu from "@/components/MobileMenu";

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
    
    let parsedItems = [];
    try {
      const itemsJson = formData.get('items_json') as string;
      if (itemsJson) {
        parsedItems = JSON.parse(itemsJson);
      }
    } catch (e) {
      console.error("Failed to parse items_json", e);
    }

    await createJob({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      notes: `Telefonos elérhetőség: ${formData.get('phone')}\nEmail: ${formData.get('email') || 'Nincs megadva'}\nSzolgáltatás: ${formData.get('service_type')}\nMegjegyzés / Részletek:\n${formData.get('message')}`,
      status: 'Ajánlatra vár',
      items: parsedItems,
      total: Number(formData.get('total') || 0)
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
  const aboutImage = settings.about_image || '/images/rubicon_szonyegtisztitas_szonyeg_felcsavaras.webp';
  
  // --- 4. SZOLGÁLTATÁSOK SZEKCIÓ ---
  const servicesTitle = settings.services_title || 'Szolgáltatásaink az Ön kényelméért';
  const srv1Title = settings.service_1_title || 'Szőnyeg-Újjáélesztés';
  const srv1Text = settings.service_1_text || 'Nem csupán mosás. Mélyrétegű extrakciót alkalmazunk, amely eltávolítja a mélyen ülő port, az atkákat és a kellemetlen szagokat. Szőnyege újra olyan lesz, mint aznap, amikor megvásárolta.';
  const srv2Title = settings.service_2_title || 'Prémium Kárpittisztítás';
  const srv2Text = settings.service_2_text || 'Kanapék, fotelek és matracok professzionális kezelése. Eltávolítjuk a foltokat és a baktériumokat, hogy családja biztonságban pihenhessen. Matractisztításunk során a teljes mélységű higiéniára fókuszálunk.';
  const srv3Title = settings.service_3_title || 'Ózonos Fertőtlenítés';
  const srv3Text = settings.service_3_text || 'A legmodernebb megoldás a szagok és kórokozók ellen. Vegyszermentes, gyors és kíméletlen a baktériumokkal, penésszel és vírusokkal szemben. Ideális választás kisgyermekes családoknak és kisállattartóknak.';

  // --- 4.5. VIDEÓK SZEKCIÓ ---
  const videosTitle = settings.videos_title || 'Nézze meg munkáinkat akció közben';
  const videosSubtitle = settings.videos_subtitle || 'Ismerje meg a folyamatot videóinkon keresztül.';
  
  const v1Title = settings.video_1_title || 'Facebook Poszt';
  const v1Desc = settings.video_1_desc || 'Egy korábbi szőnyegünk...';
  const v1Iframe = settings.video_1_iframe || '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid02vXPwHK1HUg2yxxh8m4XfysjddfhQnRxATkfvhHGshasdZpvM778KdjAwhRqvs4Bql%26id%3D100063469152945&show_text=true&width=500" width="500" height="978" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';

  const v2Title = settings.video_2_title || 'Első Reels Videónk';
  const v2Desc = settings.video_2_desc || 'Így dolgozunk a műhelyben';
  const v2Iframe = settings.video_2_iframe || '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F801175599372582%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>';

  const v3Title = settings.video_3_title || 'Második Reels Videónk';
  const v3Desc = settings.video_3_desc || 'Még egy videó a tisztításról';
  const v3Iframe = settings.video_3_iframe || '<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F993489449670381%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>';

  // --- 5. ÁRAK SZEKCIÓ ---
  const pricingTitle = settings.pricing_title || 'Átlátható árak, rejtett költségek nélkül';
  const pricingBody = settings.pricing_body || 'Nálunk nincs meglepetés a munka végén. Minden megrendelés előtt pontos elszámolást kap.';
  const pricingExtra = settings.pricing_extra || '15 m² feletti megrendelés esetén a kiszállítás és visszaszállítás költségét mi álljuk Érd és környékén!';

  const pricingRug = settings.pricing_rug || { types: {} };
  const pricingUph = settings.pricing_upholstery || { types: {} };
  const pricingCar = settings.pricing_car || { categories: {}, packages: {} };

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
      <header className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="relative h-10 w-48">
              <Image src={companyLogo} alt={settings.company_name || 'RUBICON'} fill className="object-contain object-left" priority />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#velemenyek" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Vélemények</Link>
            <Link href="#rolunk" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Rólunk</Link>
            <Link href="#szolgaltatasok" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Szolgáltatásaink</Link>
            <Link href="#referenciak" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Referenciák</Link>
            <Link href="#arak" className="font-semibold text-gray-600 hover:text-[#3AC2FE] transition-colors">Árak</Link>
            <a href="#kapcsolat" className="bg-[#1D63B7] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#3AC2FE] transition-all transform hover:scale-105 shadow-md">
              Ajánlatkérés
            </a>
          </nav>
          
          {/* Mobile Navigation */}
          <MobileMenu />
        </div>
      </header>

      <main className="bg-[#F8F9FA]">
        {/* 1. HERO Section */}
        <section className="relative overflow-hidden bg-[#181A2C]">
          {/* Background Image Container - Half height on mobile, full on desktop */}
          <div className="absolute top-0 left-0 w-full h-[60vh] md:h-full z-0">
            <Image src={heroBgImage} alt="Szőnyegtisztítás" fill className="object-cover object-[80%_top] md:object-right" priority quality={100} unoptimized />
            {/* Desktop Gradient: dark on left, transparent on right so Zoli is visible */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#181A2C]/90 via-[#181A2C]/50 to-transparent" />
            {/* Mobile Gradient: left to right for h1/h2 readability */}
            <div className="block md:hidden absolute inset-0 bg-gradient-to-r from-[#181A2C]/90 via-[#181A2C]/40 to-transparent" />
            {/* Mobile Gradient: dark at the bottom blending into the solid background below */}
            <div className="block md:hidden absolute inset-0 bg-gradient-to-t from-[#181A2C] via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-[35vh] pb-24 md:pt-32 md:pb-32 md:min-h-[90vh] flex flex-col justify-center">
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[#3AC2FE]/20 text-[#3AC2FE] font-bold text-sm tracking-widest uppercase mb-4 md:mb-6 border border-[#3AC2FE]/30">{heroBadge}</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                {heroTitle}
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 md:mb-6">
                {heroSubtitle}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-10 leading-relaxed">
                {heroParagraph}
              </p>              
              <a href="#kapcsolat" className="inline-block bg-[#3AC2FE] hover:bg-white hover:text-[#1D63B7] text-white font-bold text-xl px-10 py-5 rounded-full transition-all shadow-[0_0_40px_rgba(58,194,254,0.4)] hover:shadow-xl md:mt-8">
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
        <section id="rolunk" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image src={aboutImage} alt="Mélytisztítás hatása" width={800} height={800} className="w-full h-auto" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] pointer-events-none"></div>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#181A2C] mb-8 leading-tight">{aboutTitle}</h3>
              <div className="text-xl text-gray-600 font-light leading-relaxed mb-8 whitespace-pre-wrap">
                {aboutText}
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#kapcsolat" className="inline-block bg-[#1D63B7] hover:bg-[#3AC2FE] text-white font-bold text-lg px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl">
                  Ajánlatkérés
                </a>
                <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="inline-block bg-white hover:bg-gray-50 text-[#1D63B7] font-bold text-lg px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl border-2 border-[#1D63B7]">
                  Hívjon most
                </a>
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
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src="/images/rubicon_szonyegtisztitas_szolgaltatas.webp" alt={srv1Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#1D63B7]/10 text-[#1D63B7] rounded-2xl flex-shrink-0 flex items-center justify-center">
                      <Sparkles size={28} />
                    </div>
                    <h4 className="text-2xl font-bold text-[#181A2C]">{srv1Title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">{srv1Text}</p>
                </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src="/images/rubicon_karpittisztitas_szolgaltatas.webp" alt={srv2Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#3AC2FE]/10 text-[#3AC2FE] rounded-2xl flex-shrink-0 flex items-center justify-center">
                      <Sofa size={28} />
                    </div>
                    <h4 className="text-2xl font-bold text-[#181A2C]">{srv2Title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">{srv2Text}</p>
                </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src="/images/rubicon_autokozmetika_szolgaltatas.webp" alt={srv3Title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#181A2C]/10 text-[#181A2C] rounded-2xl flex-shrink-0 flex items-center justify-center">
                      <CarFront size={28} />
                    </div>
                    <h4 className="text-2xl font-bold text-[#181A2C]">{srv3Title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">{srv3Text}</p>
                </div>              </div>
            </div>
          </div>
        </section>

        {/* 4.5. VIDEÓK SZEKCIÓ */}
        <VideosCarousel
          title={videosTitle}
          subtitle={videosSubtitle}
          v1Title={v1Title}
          v1Desc={v1Desc}
          v1Iframe={v1Iframe}
          v2Title={v2Title}
          v2Desc={v2Desc}
          v2Iframe={v2Iframe}
          v3Title={v3Title}
          v3Desc={v3Desc}
          v3Iframe={v3Iframe}
        />

        {/* 5. ÁRAK SZEKCIÓ */}
        <section id="arak" className="py-24 bg-[#181A2C] text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{pricingTitle}</h3>
            <p className="text-xl text-gray-300 font-light mb-16 max-w-2xl mx-auto">{pricingBody}</p>

            <PricingTable 
              pricingRug={pricingRug}
              pricingUph={pricingUph}
              pricingCar={pricingCar}
            />

            <div className="inline-flex items-center gap-3 bg-[#FEC500]/20 text-[#FEC500] px-6 py-3 rounded-full font-bold text-lg mt-16">
              <Sparkles size={20} />
              {pricingExtra}
            </div>
          </div>
        </section>

        {/* 6. KAPCSOLAT SZEKCIÓ */}
        <section id="kapcsolat" className="py-24 bg-[#1D63B7] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="text-white">
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

              <div className="flex flex-col items-center justify-center">
                <div className="relative aspect-square md:aspect-video lg:aspect-square w-full">
                  <Image 
                    src="/images/rubicon_szonyegtisztitas_lefedettsegi_terkep.webp" 
                    alt="Rubicon Lefedettségi Térkép" 
                    fill 
                    className="object-contain" 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={100}
                    unoptimized={true}
                  />
                </div>
                <div className="mt-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                  <MapPin size={18} className="text-[#3AC2FE]" />
                  <span>Lefedettségi térképünk: <strong>15 km-es sugárban</strong> a telephelytől</span>
                </div>
              </div>
            </div>

            {/* Ajánlatkérő Űrlap Teljes Szélességben */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl max-w-5xl mx-auto">
              <QuoteForm 
                action={handleContact} 
                buttonText={contactCta} 
                pricingRug={pricingRug}
                pricingUph={pricingUph}
                pricingCar={pricingCar}
                deliveryFeeBase={Number(settings.delivery_fee_base) || 0}
                deliveryFeeLimit={Number(settings.delivery_fee_limit) || 0}
              />
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
              <li><Link href="#velemenyek" className="hover:text-white transition-colors">Vélemények</Link></li>
              <li><Link href="#rolunk" className="hover:text-white transition-colors">Rólunk</Link></li>
              <li><Link href="#szolgaltatasok" className="hover:text-white transition-colors">Szolgáltatásaink</Link></li>
              <li><Link href="#referenciak" className="hover:text-white transition-colors">Referenciák</Link></li>
              <li><Link href="#arak" className="hover:text-white transition-colors">Árak</Link></li>
            </ul>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} {settings.company_name || 'Rubicon Szőnyegtisztítás'}. Minden jog fenntartva.</p>
        <p className="mt-2 text-xs opacity-50">Powered by MacoLabs & Rubicon Engine v2</p>
      </footer>
    </div>
  );
}
