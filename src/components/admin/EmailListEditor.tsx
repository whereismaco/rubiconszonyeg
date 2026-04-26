'use client';
import { useState } from 'react';
import { Plus, Trash, Mail } from 'lucide-react';

export default function EmailListEditor({ data }: { data: string[] }) {
  const [items, setItems] = useState<{id: string, val: string}[]>(() => {
    return (data || []).map(val => ({ id: Math.random().toString(), val }));
  });

  const sync = (newItems: {id: string, val: string}[]) => {
    return newItems.map(it => it.val.trim()).filter(v => v !== '');
  };

  const update = (id: string, newVal: string) => {
    setItems(items.map(it => it.id === id ? { ...it, val: newVal } : it));
  };

  const remove = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const add = () => {
    setItems([...items, { id: Math.random().toString(), val: '' }]);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to pass data to Server Action */}
      <input type="hidden" name="whitelisted_emails" value={JSON.stringify(sync(items))} />
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={item.val} 
                onChange={e => update(item.id, e.target.value)} 
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]" 
                placeholder="admin@pelda.hu"
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => remove(item.id)} 
              className="text-gray-400 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-red-50 shrink-0"
              title="Törlés"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 italic pb-2">Nincsenek engedélyezett email címek.</p>}
      </div>
      
      <button type="button" onClick={add} className="text-sm bg-gray-100 text-[#181A2C] px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors font-medium w-fit">
        <Plus size={16} /> Új Email Hozzáadása
      </button>
    </div>
  );
}