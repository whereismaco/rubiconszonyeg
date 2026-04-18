import { getSettings, updateSetting } from '@/lib/actions';
import { Save } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getSettings();

  async function handleSave(formData: FormData) {
    'use server';
    for (const [key, value] of formData.entries()) {
      if (key !== '$ACTION_ID_something_internal') { // ignore next stuff
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
    revalidatePath('/rubicon-gate-portal/settings');
    revalidatePath('/'); // refresh homepage cache
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#181A2C]">Beállítások</h1>
        <p className="text-gray-500 mt-1">Cégadatok, tartalom és globális árak kezelése</p>
      </div>

      <form action={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Általános Cégadatok */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#1D63B7] border-b pb-2 mb-4">Általános Cégadatok</h3>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Cégnév</label>
            <input type="text" name="company_name" defaultValue={settings.company_name} className="w-full border rounded-lg p-2" />
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

        {/* Kiszállási Díjak & Hozzáférés */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#1D63B7] border-b pb-2 mb-4">Működési Beállítások</h3>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Kiszállási DÍj (Alap)</label>
            <input type="number" name="delivery_fee_base" defaultValue={settings.delivery_fee_base} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Kiszállási Limit (Ez az összeg felett ingyenes)</label>
            <input type="number" name="delivery_fee_limit" defaultValue={settings.delivery_fee_limit} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Engedélyezett Email címek (JSON List)</label>
            <textarea name="whitelisted_emails" defaultValue={JSON.stringify(settings.whitelisted_emails, null, 2)} className="w-full border rounded-lg p-2 font-mono text-sm" rows={3}></textarea>
            <p className="text-xs text-gray-400 mt-1">Figyelem: Ezzel a listával lehet belépni (Whitelist Auth).</p>
          </div>
        </div>

        {/* --- ÚJ: Szövegek Szerkesztése --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-2xl font-bold text-[#1D63B7] border-b pb-2 mb-4">Weboldal Tartalom (Szerkeszthető Szövegek)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hero Szekció */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">Főoldal Fejléc (Hero)</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Főcím</label>
                <input type="text" name="hero_title" defaultValue={settings.hero_title || 'Adja vissza otthona tisztaságát...'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Alcím</label>
                <textarea name="hero_subtitle" defaultValue={settings.hero_subtitle || 'Mi elszállítjuk...'} rows={3} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">3 Fő Érv</label>
                <input type="text" name="hero_bullet_1" defaultValue={settings.hero_bullet_1 || 'Háztól-házig...'} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" name="hero_bullet_2" defaultValue={settings.hero_bullet_2 || '4.6 csillagos...'} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" name="hero_bullet_3" defaultValue={settings.hero_bullet_3 || 'Professzionális...'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* A Miért mi sekció */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#181A2C]">Rólunk (A porszívózás nem elég...)</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cím</label>
                <input type="text" name="about_title" defaultValue={settings.about_title || 'A porszívózás nem elég...'} className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Szöveg</label>
                <textarea name="about_text" defaultValue={settings.about_text || 'A szőnyegek mélyén...'} rows={6} className="w-full border rounded-lg p-2 text-sm"></textarea>
              </div>
            </div>

            {/* Szolgáltatások */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
              <h4 className="font-bold text-[#181A2C]">Szolgáltatások Leírása</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input type="text" name="service_1_title" defaultValue={settings.service_1_title || 'Szőnyeg-Újjáélesztés'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_1_text" defaultValue={settings.service_1_text || 'Nem csupán mosás...'} rows={4} className="w-full border rounded-lg p-2 text-sm"></textarea>
                </div>
                <div>
                  <input type="text" name="service_2_title" defaultValue={settings.service_2_title || 'Prémium Kárpittisztítás'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_2_text" defaultValue={settings.service_2_text || 'Kanapék...'} rows={4} className="w-full border rounded-lg p-2 text-sm"></textarea>
                </div>
                <div>
                  <input type="text" name="service_3_title" defaultValue={settings.service_3_title || 'Ózonos Fertőtlenítés'} className="w-full border rounded-lg p-2 text-sm mb-2 font-bold" />
                  <textarea name="service_3_text" defaultValue={settings.service_3_text || 'A legmodernebb...'} rows={4} className="w-full border rounded-lg p-2 text-sm"></textarea>
                </div>
              </div>
            </div>

            {/* Árak szöveg */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
              <h4 className="font-bold text-[#181A2C]">Árak Szekció Szövegei</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Cím</label>
                  <input type="text" name="pricing_title" defaultValue={settings.pricing_title || 'Világos árak...'} className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Leírás</label>
                  <textarea name="pricing_body" defaultValue={settings.pricing_body || 'Nálunk nincs "rejtett költség"...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Extra Szöveg (Kiemelt sávga sáv)</label>
                  <textarea name="pricing_extra" defaultValue={settings.pricing_extra || '15 m² felett...'} rows={2} className="w-full border rounded-lg p-2 text-sm"></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Árlisták (JSON Editor) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-[#1D63B7] border-b pb-2 mb-4">Árlista Konfiguráció (Haladó)</h3>
          <p className="text-sm text-gray-500">Az árlisták JSON formátumban vannak tárolva a rugalmasság érdekében. Kérjük, figyelj a helyes szintaktikára. (A jövőben ehhez grafikus szerkesztő is készülhet).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Szőnyegtisztítás Árak</label>
              <textarea name="pricing_rug" defaultValue={JSON.stringify(settings.pricing_rug, null, 2)} className="w-full border rounded-lg p-2 font-mono text-xs bg-gray-50" rows={15}></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Kárpittisztítás Árak</label>
              <textarea name="pricing_upholstery" defaultValue={JSON.stringify(settings.pricing_upholstery, null, 2)} className="w-full border rounded-lg p-2 font-mono text-xs bg-gray-50" rows={15}></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Autótisztítás Árak</label>
              <textarea name="pricing_car" defaultValue={JSON.stringify(settings.pricing_car, null, 2)} className="w-full border rounded-lg p-2 font-mono text-xs bg-gray-50" rows={15}></textarea>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end pb-12">
          <button type="submit" className="flex items-center gap-2 bg-[#3AC2FE] hover:bg-[#1D63B7] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95">
            <Save size={20} /> Beállítások és Tartalmak Mentése
          </button>
        </div>

      </form>
    </div>
  );
}
