'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SalaryDistributionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // Create distribution buckets
  const buckets = [
    { range: '0-10L', min: 0, max: 10, count: 0 },
    { range: '10-20L', min: 10, max: 20, count: 0 },
    { range: '20-30L', min: 20, max: 30, count: 0 },
    { range: '30-40L', min: 30, max: 40, count: 0 },
    { range: '40-50L', min: 40, max: 50, count: 0 },
    { range: '50-75L', min: 50, max: 75, count: 0 },
    { range: '75L+', min: 75, max: 9999, count: 0 }
  ];

  data.forEach(s => {
    const tc = s.totalComp;
    for (const b of buckets) {
      if (tc >= b.min && tc < b.max) {
        b.count++;
        break;
      }
    }
  });

  return (
    <div className="h-48 w-full mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-2 text-zinc-400 uppercase tracking-wider">Salary Distribution (Current View)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis dataKey="range" stroke="#a1a1aa" fontSize={12} />
          <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
          <Tooltip 
            cursor={{fill: '#27272a'}}
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
          />
          <Bar dataKey="count" name="Salaries" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
