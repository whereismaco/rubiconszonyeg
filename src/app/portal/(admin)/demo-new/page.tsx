import { getSettings } from '@/lib/actions';
import CalculatorUI from '@/components/admin/CalculatorUI';

export const dynamic = 'force-dynamic';

export default async function NewJobPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#181A2C]">Intelligens Munkafelvétel (DEMO)</h1>
        <p className="text-gray-500 mt-1">Új megrendelés és automata árkalkuláció készítése</p>
      </div>

      <CalculatorUI 
        pricingRug={settings.pricing_rug || {}}
        pricingUpholstery={settings.pricing_upholstery || {}}
        pricingCar={settings.pricing_car || {}}
        deliveryFeeLimit={Number(settings.delivery_fee_limit) || 10000}
        deliveryFeeBase={Number(settings.delivery_fee_base) || 2000}
      />
    </div>
  );
}
