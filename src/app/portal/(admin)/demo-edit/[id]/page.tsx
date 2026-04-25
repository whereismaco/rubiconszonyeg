import { getSettings, getJobById } from '@/lib/actions';
import CalculatorUI from '@/components/admin/CalculatorUI';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const settings = await getSettings();
  const id = (await params).id;
  const job = await getJobById(Number(id)) as any;

  if (!job) {
    return notFound();
  }

  const deliveryFeeLimit = Number(settings.delivery_fee_limit || 10000);
  const deliveryFeeBase = Number(settings.delivery_fee_base || 2000);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#181A2C]">Intelligens Szerkesztés #{job.id} (DEMO)</h1>
        <p className="text-gray-500 mt-1">
          Az automatikus árkalkulátor szerkesztője.
        </p>
      </div>

      <CalculatorUI 
        pricingRug={settings.pricing_rug || {}} 
        pricingUpholstery={settings.pricing_upholstery || {}} 
        pricingCar={settings.pricing_car || {}} 
        deliveryFeeLimit={deliveryFeeLimit}
        deliveryFeeBase={deliveryFeeBase}
        initialJob={job}
      />
    </div>
  );
}