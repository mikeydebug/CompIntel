import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        levels: true,
        salaries: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Compute TC by standard level
    const salariesByLevel = company.salaries.reduce((acc, s) => {
      if (!acc[s.standardLevel]) acc[s.standardLevel] = [];
      acc[s.standardLevel].push(s.totalComp);
      return acc;
    }, {} as Record<number, number[]>);

    const tcByLevel = Object.keys(salariesByLevel).map(levelStr => {
      const level = parseInt(levelStr);
      const tcList = salariesByLevel[level].sort((a, b) => a - b);
      const count = tcList.length;
      return {
        level,
        p50: tcList[Math.floor(count * 0.5)],
        p25: tcList[Math.floor(count * 0.25)],
        p75: tcList[Math.floor(count * 0.75)],
        count
      };
    }).sort((a, b) => a.level - b.level);

    return NextResponse.json({
      data: {
        company,
        tcByLevel
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
