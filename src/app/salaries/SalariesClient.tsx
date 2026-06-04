'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TCBadge } from '@/components/TCBadge';
import { LevelBadge } from '@/components/LevelBadge';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTC } from '@/lib/format';

export function SalariesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters State
  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minLevel, setMinLevel] = useState(searchParams.get('minLevel') || '1');
  const [maxLevel, setMaxLevel] = useState(searchParams.get('maxLevel') || '8');
  const [minYoe, setMinYoe] = useState(searchParams.get('minYoe') || '0');
  const [maxYoe, setMaxYoe] = useState(searchParams.get('maxYoe') || '15');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'totalComp');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Data State
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (company) params.set('company', company);
    if (role) params.set('role', role);
    if (location) params.set('location', location);
    if (minLevel !== '1') params.set('minLevel', minLevel);
    if (maxLevel !== '8') params.set('maxLevel', maxLevel);
    if (minYoe !== '0') params.set('minYoe', minYoe);
    if (maxYoe !== '15') params.set('maxYoe', maxYoe);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortDir !== 'desc') params.set('sortDir', sortDir);
    if (page > 1) params.set('page', page.toString());

    router.replace(`?${params.toString()}`, { scroll: false });

    try {
      const res = await fetch(`/api/salaries?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setMeta(json.meta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [company, role, location, minLevel, maxLevel, minYoe, maxYoe, sortBy, sortDir, page, router]);

  // Debounced fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSalaries();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchSalaries]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-full">
      {/* Mobile filter toggle */}
      <div className="md:hidden p-4 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Salaries</h1>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-zinc-800 rounded-md">
          <Filter size={18} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/30 p-6 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-lg font-semibold mb-6 hidden md:block">Filters</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Company</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                value={company}
                onChange={e => { setCompany(e.target.value); setPage(1); }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search company..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
            <input
              type="text"
              value={role}
              onChange={e => { setRole(e.target.value); setPage(1); }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => { setLocation(e.target.value); setPage(1); }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Standard Level (L{minLevel} - L{maxLevel})</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="8" value={minLevel} onChange={e => { setMinLevel(e.target.value); setPage(1); }} className="w-full" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="range" min="1" max="8" value={maxLevel} onChange={e => { setMaxLevel(e.target.value); setPage(1); }} className="w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Years of Exp ({minYoe} - {maxYoe})</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={minYoe} onChange={e => { setMinYoe(e.target.value); setPage(1); }} className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm" />
              <input type="number" min="0" value={maxYoe} onChange={e => { setMaxYoe(e.target.value); setPage(1); }} className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold hidden md:block">Verified Salaries</h1>
          <div className="text-sm text-zinc-500">
            {loading ? 'Loading...' : `Found ${meta.total} entries`}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Level</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('yoe')}>YOE {sortBy==='yoe' && (sortDir==='asc'?'↑':'↓')}</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors text-right" onClick={() => toggleSort('baseSalary')}>Base {sortBy==='baseSalary' && (sortDir==='asc'?'↑':'↓')}</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors text-right" onClick={() => toggleSort('totalComp')}>Total Comp {sortBy==='totalComp' && (sortDir==='asc'?'↑':'↓')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {data.map((row: any) => (
                <React.Fragment key={row.id}>
                  <tr 
                    onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                    className="hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                          {row.company.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{row.company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{row.role}</td>
                    <td className="px-6 py-4">
                      <LevelBadge level={row.standardLevel} internalLevel={row.internalLevel} />
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{row.location}</td>
                    <td className="px-6 py-4">{row.yoe}y</td>
                    <td className="px-6 py-4 text-right text-zinc-300">{formatTC(row.baseSalary)}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      <TCBadge amount={row.totalComp} />
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="bg-zinc-900/60 border-t-0">
                      <td colSpan={7} className="px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Compensation Breakdown</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="text-sm text-zinc-400 mb-1">Base</div>
                                <div className="text-xl font-bold">{formatTC(row.baseSalary)}</div>
                              </div>
                              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="text-sm text-zinc-400 mb-1">Bonus</div>
                                <div className="text-xl font-bold text-indigo-400">{formatTC(row.bonus)}</div>
                              </div>
                              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="text-sm text-zinc-400 mb-1">Equity (yr)</div>
                                <div className="text-xl font-bold text-amber-400">{formatTC(row.equity)}</div>
                              </div>
                            </div>
                            <div className="text-sm text-zinc-500 mt-4">
                              Submitted on {new Date(row.createdAt).toLocaleDateString()}
                              {row.verified && <span className="ml-2 text-emerald-500">✓ Verified</span>}
                            </div>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[{ name: 'Comp', Base: row.baseSalary, Bonus: row.bonus, Equity: row.equity }]} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" hide />
                                <Tooltip 
                                  cursor={{fill: 'transparent'}}
                                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                />
                                <Bar dataKey="Base" stackId="a" fill="#e4e4e7" radius={[4, 0, 0, 4]} />
                                <Bar dataKey="Bonus" stackId="a" fill="#818cf8" />
                                <Bar dataKey="Equity" stackId="a" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No salaries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50 hover:bg-zinc-700"
            >
              Prev
            </button>
            <span className="px-4 py-1 text-zinc-400">Page {page} of {meta.totalPages}</span>
            <button 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50 hover:bg-zinc-700"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
