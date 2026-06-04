'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTC } from '@/lib/format';

export function CompanyScatterChart({ data }: { data: any[] }) {
  // Format the data for the scatter plot
  const scatterData = data.map(s => ({
    yoe: s.yoe,
    tc: s.totalComp,
    role: s.role,
    level: s.internalLevel
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-white mb-1">{formatTC(data.tc)}</p>
          <p className="text-sm text-zinc-400">YOE: {data.yoe} years</p>
          <p className="text-sm text-zinc-400">Role: {data.role}</p>
          <p className="text-sm text-zinc-400">Level: {data.level}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full mt-8">
      <h3 className="text-lg font-semibold mb-4 text-center">Total Compensation vs. Years of Experience</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            type="number" 
            dataKey="yoe" 
            name="Years of Experience" 
            stroke="#a1a1aa" 
            label={{ value: 'Years of Experience', position: 'bottom', fill: '#a1a1aa' }} 
          />
          <YAxis 
            type="number" 
            dataKey="tc" 
            name="Total Compensation" 
            stroke="#a1a1aa" 
            tickFormatter={(value) => formatTC(value)}
            label={{ value: 'Total Comp (LPA)', angle: -90, position: 'left', fill: '#a1a1aa' }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Salaries" data={scatterData} fill="#818cf8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
