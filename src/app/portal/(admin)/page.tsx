import { getJobs } from '@/lib/actions';
import { MapPin } from 'lucide-react';
import JobStatusEditor from '@/components/admin/JobStatusEditor';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-[#181A2C]">Ügyfélkezelő Dashboard</h1>
          <p className="text-gray-500 mt-1">Jelenlegi munkák és státuszok áttekintése</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <th className="p-4">ID</th>
                <th className="p-4">Név</th>
                <th className="p-4">Cím</th>
                <th className="p-4 w-56">Státusz</th>
                <th className="p-4 text-right">Végösszeg</th>
                <th className="p-4 text-center">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Jelenleg nincsenek aktív munkák.</td>
                </tr>
              )}
              {jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors relative">
                  <td className="p-4 font-mono text-sm text-gray-500">#{job.id}</td>
                  <td className="p-4 font-medium text-[#181A2C]">{job.name}</td>
                  <td className="p-4">
                    {job.address && (
                      <a href={job.map_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-[#1D63B7] hover:underline text-sm">
                        <MapPin size={16} className="mr-1" />
                        {job.address}
                      </a>
                    )}
                  </td>
                  <td className="p-4 relative">
                    <JobStatusEditor jobId={job.id} currentStatus={job.status} />
                  </td>
                  <td className="p-4 text-right font-bold text-[#181A2C]">
                    {job.total.toLocaleString('hu-HU')} Ft
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <a 
                      href={`/portal/edit/${job.id}`}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      title="Szerkesztés"
                    >
                      Szerkesztés
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
