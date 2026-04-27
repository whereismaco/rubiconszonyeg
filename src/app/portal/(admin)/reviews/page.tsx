import { Star, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react';
import { getReviews, addReview, deleteReview } from '@/lib/actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const reviews = await getReviews();
  const { success } = await searchParams;

  async function handleAdd(formData: FormData) {
    'use server';
    const name = formData.get('reviewer_name') as string;
    const rating = parseInt(formData.get('rating') as string, 10);
    const text = formData.get('text') as string;
    
    if (name && rating && text) {
      await addReview({ reviewer_name: name, rating, text });
      redirect('/portal/reviews?success=1');
    }
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = parseInt(formData.get('id') as string, 10);
    if (id) {
      await deleteReview(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#181A2C]">Értékelések Kezelése</h1>
          <p className="text-gray-500 mt-1">Manuálisan hozzáadhatsz új értékeléseket az oldalhoz.</p>
        </div>
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-in slide-in-from-right-4 fade-in duration-300">
            <CheckCircle2 size={20} />
            Értékelés hozzáadva!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hozzáadás Form */}
        <div className="lg:col-span-1">
          <form action={handleAdd} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 sticky top-6">
            <h3 className="text-xl font-bold text-[#064E3B] border-b pb-2 mb-4">Új Értékelés</h3>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Ügyfél neve</label>
              <input type="text" name="reviewer_name" required className="w-full border rounded-lg p-2" placeholder="Pl.: Kovács János" />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Csillagok száma (1-5)</label>
              <select name="rating" required className="w-full border rounded-lg p-2">
                <option value="5">5 Csillag (Kiváló)</option>
                <option value="4">4 Csillag (Jó)</option>
                <option value="3">3 Csillag (Közepes)</option>
                <option value="2">2 Csillag (Gyenge)</option>
                <option value="1">1 Csillag (Rossz)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Szöveges vélemény</label>
              <textarea name="text" required rows={4} className="w-full border rounded-lg p-2" placeholder="Nagyon elégedett voltam a munkával..."></textarea>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#064E3B] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
              <PlusCircle size={18} /> Hozzáadás
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-500">
              Nincsenek még értékelések a rendszerben. (Legalább 1 db 5 csillagos értékelés kell, hogy megjelenjen a főoldalon).
            </div>
          ) : (
            reviews.map((r: any) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#181A2C]">{r.reviewer_name}</span>
                    <div className="flex text-[#FEC500]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{r.text}"</p>
                </div>
                
                <form action={handleDelete} className="shrink-0">
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Törlés">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}