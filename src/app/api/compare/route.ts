import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companiesParam = searchParams.get('companies');
    const role = searchParams.get('role');
    const standardLevel = searchParams.get('standardLevel');

    if (!companiesParam) {
      return NextResponse.json({ error: 'Companies parameter is required' }, { status: 400 });
    }

    const slugs = companiesParam.split(',').map(s => s.trim()).filter(Boolean);
    if (slugs.length === 0) {
      return NextResponse.json({ error: 'Companies parameter is required' }, { status: 400 });
    }

    const companiesData = await prisma.company.findMany({
      where: { slug: { in: slugs } },
      include: {
        levels: true,
        salaries: {
          where: {
            ...(role ? { role: { contains: role } } : {}),
            ...(standardLevel ? { standardLevel: parseInt(standardLevel) } : {})
          }
        }
      }
    });

    const results = companiesData.map(company => {
      // Group salaries by standard level
      const salariesByLevel = company.salaries.reduce((acc, s) => {
        if (!acc[s.standardLevel]) acc[s.standardLevel] = [];
        acc[s.standardLevel].push(s);
        return acc;
      }, {} as Record<number, typeof company.salaries>);

      const byLevel = Object.keys(salariesByLevel).map(levelStr => {
        const standardLevel = parseInt(levelStr);
        const slrs = salariesByLevel[standardLevel];
        const tcList = slrs.map(s => s.totalComp).sort((a, b) => a - b);
        const sampleSize = tcList.length;

        // Try to find the internal level string representing this standard level for this company
        const levelMapping = company.levels.find(l => l.standardLevel === standardLevel);
        const internalLevel = levelMapping ? levelMapping.internalLevel : `L${standardLevel} (infer)`;

        return {
          standardLevel,
          internalLevel,
          p50TC: tcList[Math.floor(sampleSize * 0.5)],
          p25TC: tcList[Math.floor(sampleSize * 0.25)],
          p75TC: tcList[Math.floor(sampleSize * 0.75)],
          sampleSize
        };
      }).sort((a, b) => a.standardLevel - b.standardLevel);

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        byLevel
      };
    });

    // Ensure they return in the requested order
    const sortedResults = slugs.map(slug => results.find(r => r.slug === slug)).filter(Boolean);

    return NextResponse.json({ data: { companies: sortedResults } });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
