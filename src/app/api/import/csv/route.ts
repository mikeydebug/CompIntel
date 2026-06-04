import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeCompanyName, generateSlug, isAliasMatch } from '@/lib/normalize';
import { inferLevel } from '@/lib/level';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json({ error: 'Failed to parse CSV', details: parsed.errors }, { status: 400 });
    }

    const rows = parsed.data as Record<string, string>[];
    
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    // Preload companies to avoid N+1 querying inside loop
    const allCompanies = await prisma.company.findMany({ include: { levels: true } });
    
    for (const [index, row] of rows.entries()) {
      try {
        const companyName = row.company;
        const role = row.role;
        const internalLevel = row.level;
        const location = row.location;
        const baseSalary = parseFloat(row.base);
        const bonus = parseFloat(row.bonus || '0');
        const equity = parseFloat(row.equity || '0');
        const yoe = parseFloat(row.yoe || '0');

        if (!companyName || !role || !internalLevel || !location || isNaN(baseSalary)) {
          failed++;
          errors.push(`Row ${index + 1}: Missing required fields or invalid numbers.`);
          continue;
        }

        const normalizedName = normalizeCompanyName(companyName);
        const slug = generateSlug(normalizedName);

        let company = allCompanies.find(c => c.slug === slug || isAliasMatch(companyName, c));

        if (!company) {
          company = await prisma.company.create({
            data: {
              name: normalizedName,
              slug,
              aliases: JSON.stringify([]),
            },
            include: { levels: true }
          });
          allCompanies.push(company); // Update local cache
        }

        let standardLevel = inferLevel(yoe);
        const levelMap = company.levels.find(l => l.internalLevel === internalLevel);
        if (levelMap) {
          standardLevel = levelMap.standardLevel;
        }

        const totalComp = baseSalary + bonus + equity;

        await prisma.salaryEntry.create({
          data: {
            companyId: company.id,
            role,
            internalLevel,
            standardLevel,
            location,
            baseSalary,
            bonus,
            equity,
            totalComp,
            yearsExp: yoe,
            yoe,
            verified: false
          }
        });

        imported++;
      } catch (err: any) {
        failed++;
        errors.push(`Row ${index + 1}: ${err.message}`);
      }
    }

    return NextResponse.json({ imported, failed, errors });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
