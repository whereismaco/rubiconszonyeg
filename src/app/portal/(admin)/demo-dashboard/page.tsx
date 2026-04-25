import { getJobs } from '@/lib/actions';
import { MapPin, Phone, Mail } from 'lucide-react';
import JobStatusEditor from '@/components/admin/JobStatusEditor';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-[#181A2C]">Intelligens Dashboard (DEMO)</h1>
          <p className="text-gray-500 mt-1">Jelenlegi munkák és státuszok áttekintése (Auto-kalkulátorhoz)</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <th className="p-4">ID</th>
                <th className="p-4">Név & Kapcsolat</th>
                <th className="p-4">Cím</th>
                <th className="p-4">Tételek</th>
                <th className="p-4 w-56">Státusz</th>
                <th className="p-4 text-right">Végösszeg</th>
                <th className="p-4 text-center">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Jelenleg nincsenek aktív munkák.</td>
                </tr>
              )}
              {jobs.map((job: any) => {
                let items: any[] = [];
                try {
                  if (job.data_json) items = JSON.parse(job.data_json);
                } catch(e) {}
                
                let rugsCount = 0;
                let rugsArea = 0;
                let uphCount = 0;
                let carCount = 0;
                
                items.forEach(it => {
                  if (it.service === 'Szőnyeg') {
                    rugsCount++;
                    rugsArea += (it.area || 0);
                  } else if (it.service === 'Kárpit') {
                    uphCount++;
                  } else if (it.service === 'Autó') {
                    carCount++;
                  }
                });

                return (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors relative">
                  <td className="p-4 font-mono text-sm text-gray-500">#{job.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-[#181A2C]">{job.name}</div>
                    {job.phone ? (
                      <a href={`tel:${job.phone.replace(/\s+/g, '')}`} className="flex items-center text-gray-500 hover:text-[#1D63B7] text-sm mt-1">
                        <Phone size={14} className="mr-1" />
                        {job.phone}
                      </a>
                    ) : (
                      <span className="flex items-center text-gray-400 text-sm mt-1 italic">
                        <Phone size={14} className="mr-1" />
                        Nincs megadva
                      </span>
                    )}
                    {job.email && (
                      <a href={`mailto:${job.email}`} className="flex items-center text-gray-500 hover:text-[#1D63B7] text-sm mt-1 truncate max-w-[200px]" title={job.email}>
                        <Mail size={14} className="mr-1 shrink-0" />
                        {job.email}
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    {job.address && (
                      <a href={job.map_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-[#1D63B7] hover:underline text-sm">
                        <MapPin size={16} className="mr-1 shrink-0" />
                        <span className="line-clamp-1">{job.address}</span>
                      </a>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex flex-col gap-1">
                      {items.length === 0 && <span className="text-gray-400 italic">Üres</span>}
                      {rugsCount > 0 && <span>{rugsCount} db szőnyeg</span>}
                      {uphCount > 0 && <span>{uphCount} db kárpit</span>}
                      {carCount > 0 && <span>{carCount} db autó</span>}
                    </div>
                  </td>
                  <td className="p-4 relative">
                    <JobStatusEditor jobId={job.id} currentStatus={job.status} />
                  </td>
                  <td className="p-4 text-right font-bold text-[#181A2C]">
                    {job.total.toLocaleString('hu-HU')} Ft
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <a 
                      href={`/portal/demo-edit/${job.id}`}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      title="Szerkesztés"
                    >
                      Szerkesztés
                    </a>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
