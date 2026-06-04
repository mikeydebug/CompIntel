'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TCBadge } from '@/components/TCBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { formatTC } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('levels'); // overview, levels, salaries

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [slug]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading company profile...</div>;
  if (!data) return <div className="p-20 text-center text-red-400">Company not found.</div>;

  const { company, tcByLevel } = data;
  
  // Stats
  const tcList = company.salaries.map((s: any) => s.totalComp).sort((a: any, b: any) => a - b);
  const medianTC = tcList.length ? tcList[Math.floor(tcList.length / 2)] : 0;

  // Chart data for By Level
  const chartData = tcByLevel.map((l: any) => ({
    name: `L${l.level}`,
    p50: l.p50,
    p25: l.p25,
    p75: l.p75,
    count: l.count
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
        <div className="w-20 h-20 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-4xl text-zinc-300">
          {company.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{company.name}</h1>
          <div className="text-zinc-400 mt-2 flex gap-4">
            <span>{company.industry || 'Technology'}</span>
            <span>•</span>
            <span>{company.salaries.length} entries</span>
          </div>
        </div>
        <div className="md:ml-auto text-left md:text-right mt-4 md:mt-0">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Median TC</div>
          <div className="text-4xl font-bold text-emerald-400">{formatTC(medianTC)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 mb-8 flex gap-8">
        <button 
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'levels' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          onClick={() => setActiveTab('levels')}
        >
          By Level
          {activeTab === 'levels' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />}
        </button>
        <button 
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'salaries' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          onClick={() => setActiveTab('salaries')}
        >
          Recent Salaries
          {activeTab === 'salaries' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'levels' && (
        <div className="space-y-12">
          {/* Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Total Compensation Progression</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" tickFormatter={(value) => formatTC(value)} />
                  <Tooltip 
                    cursor={{fill: '#27272a'}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(value: any) => formatTC(value as number)}
                  />
                  <Bar dataKey="p50" name="Median TC" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill="#818cf8" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Level Mapping & Data</h3>
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Standard Level</th>
                    <th className="px-6 py-4 font-medium">Internal Level</th>
                    <th className="px-6 py-4 font-medium text-right">25th Percentile</th>
                    <th className="px-6 py-4 font-medium text-right text-white">Median TC</th>
                    <th className="px-6 py-4 font-medium text-right">75th Percentile</th>
                    <th className="px-6 py-4 font-medium text-right">Data Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {tcByLevel.map((lvl: any) => {
                    const internal = company.levels?.find((l: any) => l.standardLevel === lvl.level)?.internalLevel || 'infer';
                    return (
                      <tr key={lvl.level} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <LevelBadge level={lvl.level} />
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-300">{internal}</td>
                        <td className="px-6 py-4 text-right text-zinc-400">{formatTC(lvl.p25)}</td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-400">{formatTC(lvl.p50)}</td>
                        <td className="px-6 py-4 text-right text-zinc-400">{formatTC(lvl.p75)}</td>
                        <td className="px-6 py-4 text-right">{lvl.count}</td>
                      </tr>
                    )
                  })}
                  {tcByLevel.length === 0 && (
                    <tr><td colSpan={6} className="text-center p-8 text-zinc-500">No level data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salaries' && (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Level</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">YOE</th>
                <th className="px-6 py-4 font-medium text-right">Base</th>
                <th className="px-6 py-4 font-medium text-right">Total Comp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {company.salaries.map((s: any) => (
                <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">{s.role}</td>
                  <td className="px-6 py-4">
                    <LevelBadge level={s.standardLevel} internalLevel={s.internalLevel} />
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{s.location}</td>
                  <td className="px-6 py-4">{s.yoe}y</td>
                  <td className="px-6 py-4 text-right text-zinc-300">{formatTC(s.baseSalary)}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    <TCBadge amount={s.totalComp} />
                  </td>
                </tr>
              ))}
              {company.salaries.length === 0 && (
                <tr><td colSpan={6} className="text-center p-8 text-zinc-500">No recent salaries.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
