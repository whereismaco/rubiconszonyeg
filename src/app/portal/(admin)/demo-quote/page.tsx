import { getSettings } from '@/lib/actions';
import QuoteForm from '@/components/QuoteForm';

export const dynamic = 'force-dynamic';

export default async function DemoQuoteFormPage() {
  const settings = await getSettings();

  // Mivel ez csak egy DEMO felület az adminon belül, egy üres function-t adunk át
  const dummyAction = async () => {
    'use server';
    // No-op
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-[#181A2C] to-[#1D63B7] p-8 rounded-3xl shadow-xl text-white">
        <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#FEC500]">Intelligens Ajánlatkérő (DEMO)</h1>
        <p className="text-lg text-gray-200 leading-relaxed">
          Így nézne ki a weboldalad ajánlatkérője a látogatók számára, ha elérhető lenne az intelligens, automatikus árkalkuláció. 
          A "Haladó Mód" segítségével az ügyfelek centiméterre pontosan megadhatják az adatokat, és rögtön látják a becsült végösszeget a kiszállási díjjal együtt,
          növelve a konverziót és csökkentve a felesleges telefonálást.
        </p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <QuoteForm 
          action={dummyAction}
          buttonText="Próba Ajánlatkérés Elküldése (DEMO)"
          pricingRug={settings.pricing_rug || {}}
          pricingUph={settings.pricing_upholstery || {}}
          pricingCar={settings.pricing_car || {}}
          deliveryFeeBase={Number(settings.delivery_fee_base) || 2000}
          deliveryFeeLimit={Number(settings.delivery_fee_limit) || 10000}
          publicMode={false}
          demoMode={true}
        />
      </div>
    </div>
  );
}
