'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { formatTC } from '@/lib/format';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/companies?q=${search}`);
        if (res.ok) {
          const json = await res.json();
          setCompanies(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    const handler = setTimeout(() => {
      fetchCompanies();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tech Companies</h1>
          <p className="text-zinc-400 mt-1">Browse compensation data by company</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search companies..."
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(c => (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xl text-zinc-300">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{c.name}</h2>
                  <div className="text-sm text-zinc-400">{c.industry || 'Technology'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Median TC</div>
                  <div className="text-2xl font-bold text-emerald-400">{formatTC(c.medianTC)}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Data Points</div>
                  <div className="text-2xl font-bold">{c.entryCount}</div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-xs text-zinc-500 mb-2">P25 - P75 Range</div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className="bg-zinc-700" style={{ width: '25%' }}></div>
                  <div className="bg-emerald-500/50" style={{ width: '50%' }}></div>
                  <div className="bg-zinc-700" style={{ width: '25%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>{formatTC(c.p25TC)}</span>
                  <span>{formatTC(c.p75TC)}</span>
                </div>
              </div>

              <Link 
                href={`/companies/${c.slug}`}
                className="mt-6 block w-full text-center py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
              >
                View Details &rarr;
              </Link>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-500">
              No companies found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
