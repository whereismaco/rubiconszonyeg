import { getSettings, updateSetting } from '@/lib/actions';
import { Save, CheckCircle2 } from 'lucide-react';
import PricingEditor from '@/components/admin/PricingEditor';
import EmailListEditor from '@/components/admin/EmailListEditor';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const settings = await getSettings();
  const { success } = await searchParams;

  async function handleSave(formData: FormData) {
    'use server';
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith('$ACTION')) { // ignore next stuff
          // If pricing are JSON fields, we need to handle them differently
          if (['pricing_rug', 'pricing_upholstery', 'pricing_car', 'whitelisted_emails'].includes(key)) {
             try {
                 const parsed = JSON.parse(value as string);
                 await updateSetting(key, parsed);
             } catch(e) {
                 // Invalid JSON, maybe flash an error in real app
             }
          } else {
             await updateSetting(key, value as string);
          }
      }
    }
    revalidatePath('/portal/settings');
    revalidatePath('/'); // refresh homepage cache
    redirect('/portal/settings?success=1');
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#181A2C]">Beállítások</h1>
          <p className="text-gray-500 mt-1">Cégadatok, tartalom és globális árak kezelése</p>
        </div>
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-in slide-in-from-right-4 fade-in duration-300">
            <CheckCircle2 size={20} />
            Sikeresen mentve!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Általános Cégadatok */}
        <form action={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#064E3B] border-b pb-2 mb-4">Általános Cégadatok</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Cégnév</label>
                <input type="text" name="company_name" defaultValue={settings.company_name} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Logó URL (pl. /images/logo/rubicon-logo-fekvo.png)</label>
                <input type="text" name="company_logo" defaultValue={settings.company_logo || '/images/logo/rubicon-logo-fekvo.png'} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Cím</label>
                <input type="text" name="contact_address" defaultValue={settings.contact_address} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Telefonszám</label>
                <input type="text" name="contact_phone" defaultValue={settings.contact_phone} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email (Kapcsolat)</label>
                <input type="email" name="contact_email" defaultValue={settings.contact_email} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Kommunikációs Stílus</label>
                <select name="style_formal" defaultValue={settings.style_formal} className="w-full border rounded-lg p-2">
                  <option value="1">Magázó (Professzionális)</option>
                  <option value="0">Tegező (Közvetlen)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-[#059669] hover:bg-[#064E3B] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
              <Save size={18} /> Mentés
            </button>
          </div>
        </form>

        {/* Kiszállási Díjak & Hozzáférés */}
        <form action={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#064E3B] border-b pb-2 mb-4">Működési Beállítások</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Kiszállási DÍj (Alap)</label>
                <input type="number" name="delivery_fee_base" defaultValue={settings.delivery_fee_base} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Kiszállási Limit (Ez az összeg felett ingyenes)</label>
                <input type="number" name="delivery_fee_limit" defaultValue={settings.delivery_fee_limit} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Engedélyezett Email címek (Belépéshez)</label>
                <EmailListEditor data={settings.whitelisted_emails || []} />
              </div>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-[#059669] hover:bg-[#064E3B] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
              <Save size={18} /> Mentés
            </button>
          </div>
        </form>

        {/* --- ÚJ: Szövegek Szerkesztése --- */}
        <form action={handleSave} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#064E3B] border-b pb-2 mb-4">Weboldal Tartalom (Szerkeszthető Szövegek)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hero Szekció */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">1. Főoldal Fejléc (Hero)</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kiemelt Címke (Badge)</label>
                <input type="text" name="hero_badge" defaultValue={settings.hero_badge || 'Kiválóra Értékelt Szolgáltatás'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Főcím (H1)</label>
                <input type="text" name="hero_title" defaultValue={settings.hero_title || 'Érd legmegbízhatóbb szőnyegtisztítója'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Alcím (H2)</label>
                <textarea name="hero_subtitle" defaultValue={settings.hero_subtitle || '4,6 csillagos minőség, amiben már 76 család megbízott.'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Leírás (Paragraph)</label>
                <textarea name="hero_paragraph" defaultValue={settings.hero_paragraph || 'Ne kockáztasson amatőrökkel. Mi elszállítjuk, professzionális technológiával újjávarázsoljuk, és tisztán hozzuk vissza otthonába szőnyegeit és kárpitjait.'} rows={3} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gomb Szövege</label>
                <input type="text" name="hero_cta" defaultValue={settings.hero_cta || 'Érdeklődjön most'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Háttérkép URL (pl. /images/rubicon_szonyegtisztitas_hero_img.webp)</label>
                <input type="text" name="hero_bg_image" defaultValue={settings.hero_bg_image || '/images/rubicon_szonyegtisztitas_hero_img.webp'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* 3 Fő Érv Szekció */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">1.5. Fő Érvek (Kiemelt sáv)</h4>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">3 Fő Érv</label>
                <input type="text" name="hero_bullet_1" defaultValue={settings.hero_bullet_1 || 'Igazolt minőség: 76 valódi ügyfél véleménye alapján.'} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" name="hero_bullet_2" defaultValue={settings.hero_bullet_2 || 'Teljes kényelem: Ingyenes háztól-házig szállítás (15 m² felett).'} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" name="hero_bullet_3" defaultValue={settings.hero_bullet_3 || 'Mélytisztítás: Eltávolítjuk a port, az atkákat és a makacs foltokat is.'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* Értékelések */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">2. Értékelések (Rólunk mondták)</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cím</label>
                <input type="text" name="reviews_title" defaultValue={settings.reviews_title || 'Ügyfeleink véleménye a Rubiconról'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Leírás</label>
                <textarea name="reviews_subtitle" defaultValue={settings.reviews_subtitle || 'Nem csupán ígérjük a minőséget – ügyfeleink visszajelzései a garanciánk a kiváló munkára.'} rows={3} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
            </div>

            {/* A Miért mi sekció */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">3. Rólunk (A porszívózás nem elég...)</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cím</label>
                <input type="text" name="about_title" defaultValue={settings.about_title || 'A porszívózás nem elég a valódi tisztasághoz.'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Szöveg</label>
                <textarea name="about_text" defaultValue={settings.about_text || 'Hartmann Zoltán vagyok, a Rubicon alapítója...'} rows={6} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kép URL (pl. /images/rubicon_szonyegtisztitas_szonyeg_felcsavaras.webp)</label>
                <input type="text" name="about_image" defaultValue={settings.about_image || '/images/rubicon_szonyegtisztitas_szonyeg_felcsavaras.webp'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* Szolgáltatások */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
              <h4 className="font-bold text-[#181A2C]">4. Szolgáltatások Leírása</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Szekció Címe</label>
                <input type="text" name="services_title" defaultValue={settings.services_title || 'Szolgáltatásaink az Ön kényelméért'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <input type="text" name="service_1_title" defaultValue={settings.service_1_title || 'Szőnyeg-Újjáélesztés'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_1_text" defaultValue={settings.service_1_text || 'Nem csupán mosás...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                  <label className="block text-xs text-gray-500 font-bold">1. Szolgáltatás Videó Iframe (Opcionális)</label>
                  <textarea name="service_1_iframe" defaultValue={settings.service_1_iframe || ''} rows={2} className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="<iframe src='...' ...></iframe>"></textarea>
                </div>
                <div className="space-y-2">
                  <input type="text" name="service_2_title" defaultValue={settings.service_2_title || 'Prémium Kárpittisztítás'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_2_text" defaultValue={settings.service_2_text || 'Kanapék...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                  <label className="block text-xs text-gray-500 font-bold">2. Szolgáltatás Videó Iframe (Opcionális)</label>
                  <textarea name="service_2_iframe" defaultValue={settings.service_2_iframe || ''} rows={2} className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="<iframe src='...' ...></iframe>"></textarea>
                </div>
                <div className="space-y-2">
                  <input type="text" name="service_3_title" defaultValue={settings.service_3_title || 'Ózonos Fertőtlenítés'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_3_text" defaultValue={settings.service_3_text || 'A legmodernebb...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                  <label className="block text-xs text-gray-500 font-bold">3. Szolgáltatás Videó Iframe (Opcionális)</label>
                  <textarea name="service_3_iframe" defaultValue={settings.service_3_iframe || ''} rows={2} className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="<iframe src='...' ...></iframe>"></textarea>
                </div>
                <div className="space-y-2">
                  <input type="text" name="service_4_title" defaultValue={settings.service_4_title || 'Padlószőnyeg tisztítás'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_4_text" defaultValue={settings.service_4_text || 'Helyszíni tisztítás...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                  <label className="block text-xs text-gray-500 font-bold">4. Szolgáltatás Videó Iframe (Opcionális)</label>
                  <textarea name="service_4_iframe" defaultValue={settings.service_4_iframe || ''} rows={2} className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="<iframe src='...' ...></iframe>"></textarea>
                </div>
              </div>
            </div>

            {/* Árak szöveg */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">5. Árak Szekció Szövegei</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cím</label>
                <input type="text" name="pricing_title" defaultValue={settings.pricing_title || 'Átlátható árak, rejtett költségek nélkül'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Leírás</label>
                <textarea name="pricing_body" defaultValue={settings.pricing_body || 'Nálunk nincs meglepetés a munka végén. Minden megrendelés előtt pontos elszámolást kap.'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Extra Szöveg (Kiemelt ajánlat)</label>
                <textarea name="pricing_extra" defaultValue={settings.pricing_extra || '15 m² feletti megrendelés esetén a kiszállítás és visszaszállítás költségét mi álljuk Érd és környékén!'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
            </div>

            {/* Kapcsolat */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">6. Kapcsolat Szekció</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cím</label>
                <input type="text" name="contact_title" defaultValue={settings.contact_title || 'Érdeklődjön most, és szabaduljon meg a takarítás gondjától!'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Leírás</label>
                <textarea name="contact_subtitle" defaultValue={settings.contact_subtitle || 'Töltse ki az alábbi mezőket, és 24 órán belül felvesszük Önnel a kapcsolatot az időpont egyeztetése miatt.'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gomb Szövege</label>
                <input type="text" name="contact_cta" defaultValue={settings.contact_cta || 'Kérem a tiszta szőnyeget – Érdeklődés'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>

          </div>
          </div>
          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-[#059669] hover:bg-[#064E3B] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
              <Save size={18} /> Tartalmak Mentése
            </button>
          </div>
        </form>

        {/* Árlisták (Vizuális Szerkesztő) */}
        <form action={handleSave} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#064E3B] border-b pb-2 mb-4">Árlista Konfiguráció</h3>
          <p className="text-sm text-gray-500 mb-6">Itt tudod módosítani az alapárakat, a választható extrákat és az anyagokat. A megadott értékek azonnal frissülnek a főoldalon és az új munkák kalkulátorában.</p>
          
          <PricingEditor 
            initialRug={settings.pricing_rug} 
            initialUph={settings.pricing_upholstery} 
            initialCar={settings.pricing_car} 
          />
          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-[#059669] hover:bg-[#064E3B] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
              <Save size={18} /> Árak Mentése
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
