import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SalaryQuerySchema, SalarySubmitSchema } from '@/lib/validations';
import { normalizeCompanyName, generateSlug, isAliasMatch } from '@/lib/normalize';
import { inferLevel } from '@/lib/level';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const parsed = SalaryQuerySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.issues }, { status: 400 });
    }

    const { company, role, location, minLevel, maxLevel, minYoe, maxYoe, page, limit, sortBy, sortDir } = parsed.data;

    const where: Prisma.SalaryEntryWhereInput = {};

    if (company) {
      // In a real app we might match company ID, but here we search by slug or name
      const c = await prisma.company.findFirst({
        where: { OR: [{ slug: company }, { name: { contains: company } }] }
      });
      if (c) where.companyId = c.id;
      else where.companyId = 'not-found';
    }

    if (role) where.role = { contains: role };
    if (location) where.location = { contains: location };
    
    if (minLevel !== undefined || maxLevel !== undefined) {
      where.standardLevel = {};
      if (minLevel !== undefined) where.standardLevel.gte = minLevel;
      if (maxLevel !== undefined) where.standardLevel.lte = maxLevel;
    }
    
    if (minYoe !== undefined || maxYoe !== undefined) {
      where.yoe = {};
      if (minYoe !== undefined) where.yoe.gte = minYoe;
      if (maxYoe !== undefined) where.yoe.lte = maxYoe;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.salaryEntry.findMany({
        where,
        include: { company: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDir }
      }),
      prisma.salaryEntry.count({ where })
    ]);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SalarySubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation Error', details: parsed.error.issues }, { status: 400 });
    }

    const { companyName, role, internalLevel, location, baseSalary, bonus, equity, yearsExp } = parsed.data;

    // Normalization
    const normalizedName = normalizeCompanyName(companyName);
    const slug = generateSlug(normalizedName);

    // Find or create company
    let company = await prisma.company.findUnique({ where: { slug } });
    
    if (!company) {
      // Check aliases just in case
      const allCompanies = await prisma.company.findMany();
      const matchedAlias = allCompanies.find(c => isAliasMatch(companyName, c));
      
      if (matchedAlias) {
        company = matchedAlias;
      } else {
        company = await prisma.company.create({
          data: {
            name: normalizedName,
            slug,
            aliases: JSON.stringify([]),
          }
        });
      }
    }

    // Compute standard level
    let standardLevel = inferLevel(yearsExp);
    const levelMap = await prisma.levelMap.findUnique({
      where: {
        companyId_internalLevel: {
          companyId: company.id,
          internalLevel
        }
      }
    });

    if (levelMap) {
      standardLevel = levelMap.standardLevel;
    } else {
      console.warn(`[WARN] Level map not found for ${company.name} / ${internalLevel}. Using heuristic level ${standardLevel}.`);
      // We could optionally create it here, but let's just proceed without it for now.
    }

    // Compute TC
    const totalComp = baseSalary + bonus + equity;

    // Optional: get userId from session (for duplicate check)
    const userId = "anonymous"; // TODO: Implement real session userId from NextAuth

    // Duplicate check: same company, role, level in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // In our simplified logic, we skip duplicate check if anonymous, or check IP.
    // For this assignment, we assume userId is always set or we just skip if "anonymous".
    
    if (userId !== "anonymous") {
        const duplicate = await prisma.salaryEntry.findFirst({
        where: {
            userId,
            companyId: company.id,
            role,
            internalLevel,
            createdAt: { gte: thirtyDaysAgo }
        }
        });

        if (duplicate) {
        return NextResponse.json({ error: 'Duplicate entry detected within 30 days.' }, { status: 409 });
        }
    }

    const entry = await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        userId: userId === "anonymous" ? null : userId,
        role,
        internalLevel,
        standardLevel,
        location,
        baseSalary,
        bonus,
        equity,
        totalComp,
        yearsExp,
        yoe: yearsExp,
        verified: false,
      },
      include: { company: true }
    });

    return NextResponse.json({ data: entry }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
