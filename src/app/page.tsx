import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Building2, IndianRupee, MapPin, Users } from 'lucide-react';

export default async function Home() {
  const [totalEntries, companiesCount, citiesCount, topCompanies] = await Promise.all([
    prisma.salaryEntry.count(),
    prisma.company.count(),
    prisma.salaryEntry.findMany({
      select: { location: true },
      distinct: ['location']
    }).then(res => res.length),
    prisma.company.findMany({
      include: { _count: { select: { salaries: true } } },
      orderBy: { salaries: { _count: 'desc' } },
      take: 8
    })
  ]);

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 mb-8 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Now tracking {totalEntries.toLocaleString()}+ verified salaries
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Transparent compensation data <br className="hidden md:block" /> for Indian tech.
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Stop guessing your worth. Compare salaries, equity, and bonuses across top companies standardized by level.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/salaries"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Explore salaries
            </Link>
            <Link
              href="/submit"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Add your salary
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center">
            <div>
              <div className="flex justify-center mb-4"><Users className="text-indigo-400" size={32} /></div>
              <div className="text-4xl font-bold text-white mb-2">{totalEntries}</div>
              <div className="text-zinc-500 font-medium text-sm tracking-wide uppercase">Salaries Added</div>
            </div>
            <div>
              <div className="flex justify-center mb-4"><Building2 className="text-emerald-400" size={32} /></div>
              <div className="text-4xl font-bold text-white mb-2">{companiesCount}</div>
              <div className="text-zinc-500 font-medium text-sm tracking-wide uppercase">Companies Tracked</div>
            </div>
            <div>
              <div className="flex justify-center mb-4"><MapPin className="text-amber-400" size={32} /></div>
              <div className="text-4xl font-bold text-white mb-2">{citiesCount}</div>
              <div className="text-zinc-500 font-medium text-sm tracking-wide uppercase">Tech Hubs</div>
            </div>
            <div>
              <div className="flex justify-center mb-4"><IndianRupee className="text-purple-400" size={32} /></div>
              <div className="text-4xl font-bold text-white mb-2">₹12.5L+</div>
              <div className="text-zinc-500 font-medium text-sm tracking-wide uppercase">Median Comp</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center">Featured Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topCompanies.map(c => (
              <Link 
                key={c.id} 
                href={`/companies/${c.slug}`}
                className="group flex flex-col items-center p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 transition-all hover:border-zinc-700"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xl mb-4 text-zinc-300 group-hover:scale-110 transition-transform">
                  {c.name.charAt(0)}
                </div>
                <div className="font-semibold text-lg">{c.name}</div>
                <div className="text-sm text-zinc-500 mt-1">{c._count.salaries} entries</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
