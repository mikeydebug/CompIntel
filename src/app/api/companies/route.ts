import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const industry = searchParams.get('industry') || '';

    const where: Prisma.CompanyWhereInput = {};

    if (q) {
      where.name = { contains: q };
      // Also match aliases? Prisma SQLite doesn't have JSON operations easily, 
      // but contains on the stringified JSON works ok for simple matches.
      where.OR = [
        { name: { contains: q } },
        { aliases: { contains: q } }
      ];
    }
    if (industry) {
      where.industry = industry;
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        salaries: {
          select: {
            totalComp: true,
            role: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const enriched = companies.map(c => {
      const tcList = c.salaries.map(s => s.totalComp).sort((a, b) => a - b);
      const entryCount = tcList.length;
      let medianTC = 0;
      let p25TC = 0;
      let p75TC = 0;
      
      if (entryCount > 0) {
        medianTC = tcList[Math.floor(entryCount * 0.5)];
        p25TC = tcList[Math.floor(entryCount * 0.25)];
        p75TC = tcList[Math.floor(entryCount * 0.75)];
      }

      // get top 2 roles
      const roleCounts = c.salaries.reduce((acc, s) => {
        acc[s.role] = (acc[s.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topRoles = Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(x => x[0]);

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        entryCount,
        medianTC,
        p25TC,
        p75TC,
        topRoles
      };
    });

    // Sort by entry count mostly
    enriched.sort((a, b) => b.entryCount - a.entryCount);

    return NextResponse.json({ data: enriched });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
