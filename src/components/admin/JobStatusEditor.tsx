'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { updateJobStatus } from '@/lib/actions';

const statuses = [
  'Felvételre vár',
  'Beérkezett',
  'Tisztítás alatt',
  'Elkészült',
  'Kiszállítva'
];

const statusColors: Record<string, string> = {
  'Felvételre vár': 'bg-red-100 text-red-800 border-red-200',
  'Beérkezett': 'bg-orange-100 text-orange-800 border-orange-200',
  'Tisztítás alatt': 'bg-blue-100 text-blue-800 border-blue-200',
  'Elkészült': 'bg-green-100 text-green-800 border-green-200',
  'Kiszállítva': 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function JobStatusEditor({ jobId, currentStatus }: { jobId: number, currentStatus: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await updateJobStatus(jobId, selectedStatus);
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-lg absolute z-10 -ml-2 -mt-1.5">
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-2 py-1 outline-none focus:ring-1 focus:ring-[#3AC2FE]"
          disabled={isLoading}
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
          title="Mentés"
        >
          <Check size={16} />
        </button>
        <button 
          onClick={handleCancel} 
          disabled={isLoading}
          className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
          title="Mégse"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[currentStatus] || 'bg-gray-100 text-gray-800'}`}>
        {currentStatus}
      </span>
      <button 
        onClick={() => setIsEditing(true)}
        className="p-1.5 text-gray-400 hover:text-[#1D63B7] hover:bg-blue-50 rounded-lg transition-all focus:opacity-100"
        title="Státusz módosítása"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}
