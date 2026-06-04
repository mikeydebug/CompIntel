'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatTC } from '@/lib/format';

export function HomeChart({ data }: { data: any[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 mt-12 w-full max-w-5xl mx-auto shadow-2xl">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <p className="text-zinc-400">Median Total Compensation by Standard Level</p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" tickFormatter={(value) => formatTC(value)} />
            <Tooltip 
              cursor={{fill: '#27272a'}}
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
              formatter={(value: any) => formatTC(value as number)}
            />
            <Bar dataKey="median" name="Median TC" radius={[4, 4, 0, 0]}>
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill="#34d399" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
