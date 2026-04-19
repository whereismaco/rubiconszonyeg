'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email);
    if (res?.success) {
      router.push('/portal');
    } else {
      setError(res?.error || 'Hibás bejelentkezés.');
    }
  };

  return (
    <div className="min-h-screen bg-[#181A2C] flex items-center justify-center p-4">
      <div className="bg-[#EDEDED] max-w-sm w-full p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-[#1D63B7] mb-6 text-center">Admin Belépés</h1>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#181A2C] mb-1">Email cím</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[#181A2C] placeholder-gray-400 focus:outline-none focus:border-[#3AC2FE] focus:ring-1 focus:ring-[#3AC2FE]"
              placeholder="zoli@example.com"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#1D63B7] hover:bg-[#3AC2FE] text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Belépés
          </button>
        </form>
      </div>
    </div>
  );
}
