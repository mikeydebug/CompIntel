'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Check, X, AlertCircle } from 'lucide-react';
import { formatTC } from '@/lib/format';
import { TCBadge } from '@/components/TCBadge';
import { LevelBadge } from '@/components/LevelBadge';

export default function AdminPage() {
  const { status } = useSession();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSalaries();
    } else if (status === 'unauthenticated') {
      setError('You must be signed in to access the admin portal.');
      setLoading(false);
    }
  }, [status]);

  const fetchSalaries = async () => {
    try {
      const res = await fetch('/api/admin/salaries');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setSalaries(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/salaries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (!res.ok) throw new Error('Failed to update');
      
      // Remove from list
      setSalaries(salaries.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading admin portal...</div>;

  if (error) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
      <p className="text-zinc-400">{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-indigo-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-zinc-400">Review and moderate unverified salary submissions.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Role / Level</th>
              <th className="px-6 py-4 font-medium">Comp Breakdown</th>
              <th className="px-6 py-4 font-medium">Total Comp</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {salaries.map(s => (
              <tr key={s.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">{s.company.name}</td>
                <td className="px-6 py-4">
                  <div className="mb-1">{s.role} ({s.yoe}y)</div>
                  <LevelBadge level={s.standardLevel} internalLevel={s.internalLevel} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-zinc-400">Base: {formatTC(s.baseSalary)}</div>
                  <div className="text-xs text-indigo-400">Bonus: {formatTC(s.bonus)}</div>
                  <div className="text-xs text-amber-400">Equity: {formatTC(s.equity)}</div>
                </td>
                <td className="px-6 py-4">
                  <TCBadge amount={s.totalComp} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleAction(s.id, 'approve')}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(s.id, 'reject')}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {salaries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <ShieldCheck className="mx-auto mb-4 opacity-20" size={48} />
                  No pending submissions. You're all caught up!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
