'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatTC } from '@/lib/format';
import { LevelBadge } from '@/components/LevelBadge';
import { Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companiesParam = searchParams.get('companies') || '';
  
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    companiesParam ? companiesParam.split(',').filter(Boolean) : []
  );
  
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // Fetch company list for the selector
  useEffect(() => {
    fetch('/api/companies?limit=100')
      .then(res => res.json())
      .then(json => setAllCompanies(json.data || []));
  }, []);

  // Fetch comparison data
  useEffect(() => {
    if (selectedSlugs.length < 1) {
      setCompareData(null);
      return;
    }
    
    setLoading(true);
    fetch(`/api/compare?companies=${selectedSlugs.join(',')}`)
      .then(res => res.json())
      .then(json => {
        setCompareData(json.data);
      })
      .finally(() => setLoading(false));
  }, [selectedSlugs]);

  const toggleCompany = (slug: string) => {
    let newSlugs = [...selectedSlugs];
    if (newSlugs.includes(slug)) {
      newSlugs = newSlugs.filter(s => s !== slug);
    } else {
      if (newSlugs.length >= 3) newSlugs.shift(); // max 3
      newSlugs.push(slug);
    }
    setSelectedSlugs(newSlugs);
    router.replace(`/compare?companies=${newSlugs.join(',')}`, { scroll: false });
  };

  const filteredCompanies = allCompanies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Prepare chart data
  const chartData: any[] = [];
  if (compareData && compareData.companies) {
    const allLevels = new Set<number>();
    compareData.companies.forEach((c: any) => {
      c.byLevel.forEach((l: any) => allLevels.add(l.standardLevel));
    });
    
    Array.from(allLevels).sort().forEach(level => {
      const dataPoint: any = { name: `L${level}`, level };
      compareData.companies.forEach((c: any) => {
        const match = c.byLevel.find((l: any) => l.standardLevel === level);
        if (match) {
          dataPoint[c.name] = match.p50TC;
        }
      });
      chartData.push(dataPoint);
    });
  }

  const colors = ['#818cf8', '#34d399', '#fbbf24'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Compare Compensation</h1>
      <p className="text-zinc-400 mb-8">Select up to 3 companies to compare their total compensation across standard levels.</p>

      {/* Selector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Select Companies (Max 3)</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSlugs.map((slug, i) => {
            const c = allCompanies.find(x => x.slug === slug) || { name: slug };
            return (
              <span key={slug} className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-md text-sm border border-zinc-700" style={{ borderLeftColor: colors[i], borderLeftWidth: 4 }}>
                {c.name}
                <button onClick={() => toggleCompany(slug)} className="text-zinc-500 hover:text-white">&times;</button>
              </span>
            );
          })}
        </div>
        
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search to add company..."
          />
        </div>
        
        {search && (
          <div className="flex flex-wrap gap-2 mt-4 max-h-40 overflow-y-auto">
            {filteredCompanies.slice(0, 10).map(c => (
              <button
                key={c.slug}
                onClick={() => { toggleCompany(c.slug); setSearch(''); }}
                disabled={selectedSlugs.length >= 3 && !selectedSlugs.includes(c.slug)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedSlugs.includes(c.slug) 
                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' 
                    : 'bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <div className="p-12 text-center text-zinc-500 animate-pulse">Loading comparison...</div>}

      {!loading && compareData && compareData.companies.length > 0 && (
        <div className="space-y-8">
          {/* Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Median TC by Level</h3>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" tickFormatter={(value) => formatTC(value)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(value: number) => formatTC(value)}
                  />
                  <Legend />
                  {compareData.companies.map((c: any, index: number) => (
                    <Line 
                      key={c.slug} 
                      type="monotone" 
                      dataKey={c.name} 
                      stroke={colors[index]} 
                      strokeWidth={3} 
                      dot={{ r: 6, strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Comparison */}
          <div className="border border-zinc-800 rounded-xl overflow-x-auto bg-zinc-900/40">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium sticky left-0 bg-zinc-900 border-r border-zinc-800 z-10">Standard Level</th>
                  {compareData.companies.map((c: any, i: number) => (
                    <th key={c.slug} className="px-6 py-4 font-medium" style={{ color: colors[i] }}>
                      {c.name}
                    </th>
                  ))}
                  {compareData.companies.length >= 2 && (
                    <th className="px-6 py-4 font-medium text-right bg-zinc-900/50">
                      Delta (Top vs Lowest)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {Array.from(new Set(chartData.map(d => d.level))).map(level => {
                  const items = compareData.companies.map((c: any) => c.byLevel.find((l: any) => l.standardLevel === level));
                  const validTCs = items.map((i: any) => i?.p50TC).filter(Boolean);
                  const maxTC = validTCs.length ? Math.max(...validTCs) : 0;
                  const minTC = validTCs.length ? Math.min(...validTCs) : 0;
                  const delta = maxTC - minTC;

                  return (
                    <tr key={level} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 sticky left-0 bg-zinc-950/80 border-r border-zinc-800 z-10">
                        <LevelBadge level={level} />
                      </td>
                      {items.map((item: any, i: number) => (
                        <td key={i} className="px-6 py-4">
                          {item ? (
                            <div>
                              <div className="font-bold text-lg mb-1">{formatTC(item.p50TC)}</div>
                              <div className="text-xs text-zinc-500 font-mono">{item.internalLevel}</div>
                              <div className="text-xs text-zinc-600 mt-1">n={item.sampleSize}</div>
                            </div>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                      ))}
                      {compareData.companies.length >= 2 && (
                        <td className="px-6 py-4 text-right bg-zinc-900/20">
                          {validTCs.length >= 2 && delta > 0 ? (
                            <span className="text-emerald-400 font-medium">+{formatTC(delta)}</span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
