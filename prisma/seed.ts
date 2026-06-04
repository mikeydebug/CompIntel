const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const companiesData = [
    {
      name: 'Google',
      slug: 'google',
      aliases: JSON.stringify(['Google LLC', 'Google India']),
      industry: 'Internet',
      levels: [
        { internalLevel: 'L3', standardLevel: 2 },
        { internalLevel: 'L4', standardLevel: 3 },
        { internalLevel: 'L5', standardLevel: 4 },
        { internalLevel: 'L6', standardLevel: 5 },
        { internalLevel: 'L7', standardLevel: 6 },
      ]
    },
    {
      name: 'Amazon',
      slug: 'amazon',
      aliases: JSON.stringify(['Amazon Web Services', 'AWS', 'Amazon India']),
      industry: 'E-commerce',
      levels: [
        { internalLevel: 'SDE1', standardLevel: 2 },
        { internalLevel: 'SDE2', standardLevel: 4 },
        { internalLevel: 'SDE3', standardLevel: 5 },
        { internalLevel: 'Principal', standardLevel: 6 },
      ]
    },
    {
      name: 'Flipkart',
      slug: 'flipkart',
      aliases: JSON.stringify(['Flipkart Internet']),
      industry: 'E-commerce',
      levels: [
        { internalLevel: 'SDE1', standardLevel: 2 },
        { internalLevel: 'SDE2', standardLevel: 3 },
        { internalLevel: 'SDE3', standardLevel: 4 },
        { internalLevel: 'Staff', standardLevel: 5 },
        { internalLevel: 'Principal', standardLevel: 6 },
      ]
    },
    {
      name: 'Swiggy',
      slug: 'swiggy',
      aliases: JSON.stringify(['Bundl Technologies']),
      industry: 'Food Delivery',
      levels: [
        { internalLevel: 'Junior', standardLevel: 2 },
        { internalLevel: 'Mid', standardLevel: 3 },
        { internalLevel: 'Senior', standardLevel: 4 },
        { internalLevel: 'Staff', standardLevel: 5 },
      ]
    },
    {
      name: 'Zepto',
      slug: 'zepto',
      aliases: JSON.stringify(['Kiranakart Technologies']),
      industry: 'Quick Commerce',
      levels: [
        { internalLevel: 'Junior', standardLevel: 2 },
        { internalLevel: 'Mid', standardLevel: 3 },
        { internalLevel: 'Senior', standardLevel: 4 },
        { internalLevel: 'Staff', standardLevel: 5 },
      ]
    },
    {
      name: 'Microsoft',
      slug: 'microsoft',
      aliases: JSON.stringify(['Microsoft India']),
      industry: 'Software',
      levels: [
        { internalLevel: '59', standardLevel: 2 },
        { internalLevel: '60', standardLevel: 2 },
        { internalLevel: '61', standardLevel: 3 },
        { internalLevel: '62', standardLevel: 4 },
        { internalLevel: '63', standardLevel: 5 },
        { internalLevel: '64', standardLevel: 5 },
        { internalLevel: '65', standardLevel: 6 },
      ]
    }
  ];

  for (const cData of companiesData) {
    const company = await prisma.company.upsert({
      where: { slug: cData.slug },
      update: {},
      create: {
        name: cData.name,
        slug: cData.slug,
        aliases: cData.aliases,
        industry: cData.industry,
      }
    });

    for (const lvl of cData.levels) {
      await prisma.levelMap.upsert({
        where: {
          companyId_internalLevel: {
            companyId: company.id,
            internalLevel: lvl.internalLevel
          }
        },
        update: {},
        create: {
          companyId: company.id,
          internalLevel: lvl.internalLevel,
          standardLevel: lvl.standardLevel
        }
      });
    }
  }

  // Fetch created companies
  const companies = await prisma.company.findMany();
  const google = companies.find((c: any) => c.slug === 'google');
  const amazon = companies.find((c: any) => c.slug === 'amazon');
  const flipkart = companies.find((c: any) => c.slug === 'flipkart');
  const swiggy = companies.find((c: any) => c.slug === 'swiggy');
  const zepto = companies.find((c: any) => c.slug === 'zepto');
  const microsoft = companies.find((c: any) => c.slug === 'microsoft');

  const salariesData = [
    // Google Entries
    { companyId: google.id, role: 'Software Engineer', internalLevel: 'L3', standardLevel: 2, location: 'Bangalore', baseSalary: 18, bonus: 2, equity: 10, totalComp: 30, yearsExp: 1, yoe: 1, verified: true },
    { companyId: google.id, role: 'Software Engineer', internalLevel: 'L4', standardLevel: 3, location: 'Bangalore', baseSalary: 35, bonus: 5, equity: 15, totalComp: 55, yearsExp: 3, yoe: 3, verified: true },
    { companyId: google.id, role: 'Software Engineer', internalLevel: 'L5', standardLevel: 4, location: 'Bangalore', baseSalary: 55, bonus: 10, equity: 30, totalComp: 95, yearsExp: 6, yoe: 6, verified: true },
    { companyId: google.id, role: 'Software Engineer', internalLevel: 'L6', standardLevel: 5, location: 'Hyderabad', baseSalary: 80, bonus: 20, equity: 50, totalComp: 150, yearsExp: 10, yoe: 10, verified: true },

    // Amazon Entries
    { companyId: amazon.id, role: 'Software Development Engineer', internalLevel: 'SDE1', standardLevel: 2, location: 'Bangalore', baseSalary: 16, bonus: 3, equity: 2, totalComp: 21, yearsExp: 0, yoe: 0, verified: true },
    { companyId: amazon.id, role: 'Software Development Engineer', internalLevel: 'SDE2', standardLevel: 4, location: 'Bangalore', baseSalary: 45, bonus: 0, equity: 15, totalComp: 60, yearsExp: 4, yoe: 4, verified: true },
    { companyId: amazon.id, role: 'Software Development Engineer', internalLevel: 'SDE3', standardLevel: 5, location: 'Delhi', baseSalary: 70, bonus: 0, equity: 35, totalComp: 105, yearsExp: 8, yoe: 8, verified: true },

    // Flipkart Entries
    { companyId: flipkart.id, role: 'Software Engineer', internalLevel: 'SDE1', standardLevel: 2, location: 'Bangalore', baseSalary: 18, bonus: 1.8, equity: 4, totalComp: 23.8, yearsExp: 1, yoe: 1, verified: true },
    { companyId: flipkart.id, role: 'Software Engineer', internalLevel: 'SDE2', standardLevel: 3, location: 'Bangalore', baseSalary: 28, bonus: 2.8, equity: 8, totalComp: 38.8, yearsExp: 3, yoe: 3, verified: true },
    { companyId: flipkart.id, role: 'Software Engineer', internalLevel: 'SDE3', standardLevel: 4, location: 'Bangalore', baseSalary: 48, bonus: 4.8, equity: 15, totalComp: 67.8, yearsExp: 6, yoe: 6, verified: true },
    { companyId: flipkart.id, role: 'Software Engineer', internalLevel: 'Staff', standardLevel: 5, location: 'Bangalore', baseSalary: 65, bonus: 6.5, equity: 25, totalComp: 96.5, yearsExp: 9, yoe: 9, verified: true },

    // Swiggy Entries
    { companyId: swiggy.id, role: 'SDE', internalLevel: 'Junior', standardLevel: 2, location: 'Bangalore', baseSalary: 15, bonus: 1.5, equity: 2, totalComp: 18.5, yearsExp: 1, yoe: 1, verified: false },
    { companyId: swiggy.id, role: 'SDE', internalLevel: 'Mid', standardLevel: 3, location: 'Bangalore', baseSalary: 26, bonus: 2.6, equity: 5, totalComp: 33.6, yearsExp: 3, yoe: 3, verified: true },
    { companyId: swiggy.id, role: 'SDE', internalLevel: 'Senior', standardLevel: 4, location: 'Bangalore', baseSalary: 42, bonus: 4.2, equity: 12, totalComp: 58.2, yearsExp: 5, yoe: 5, verified: true },

    // Zepto Entries
    { companyId: zepto.id, role: 'SDE', internalLevel: 'Mid', standardLevel: 3, location: 'Mumbai', baseSalary: 25, bonus: 0, equity: 5, totalComp: 30, yearsExp: 2, yoe: 2, verified: true },
    { companyId: zepto.id, role: 'SDE', internalLevel: 'Senior', standardLevel: 4, location: 'Mumbai', baseSalary: 45, bonus: 0, equity: 10, totalComp: 55, yearsExp: 5, yoe: 5, verified: true },

    // Microsoft Entries
    { companyId: microsoft.id, role: 'Software Engineer', internalLevel: '59', standardLevel: 2, location: 'Hyderabad', baseSalary: 14, bonus: 2, equity: 4, totalComp: 20, yearsExp: 0, yoe: 0, verified: true },
    { companyId: microsoft.id, role: 'Software Engineer', internalLevel: '61', standardLevel: 3, location: 'Hyderabad', baseSalary: 24, bonus: 4, equity: 8, totalComp: 36, yearsExp: 3, yoe: 3, verified: true },
    { companyId: microsoft.id, role: 'Software Engineer', internalLevel: '62', standardLevel: 4, location: 'Bangalore', baseSalary: 35, bonus: 7, equity: 12, totalComp: 54, yearsExp: 5, yoe: 5, verified: true },
    { companyId: microsoft.id, role: 'Software Engineer', internalLevel: '64', standardLevel: 5, location: 'Hyderabad', baseSalary: 60, bonus: 12, equity: 25, totalComp: 97, yearsExp: 9, yoe: 9, verified: true },
    { companyId: microsoft.id, role: 'Principal Software Engineer', internalLevel: '65', standardLevel: 6, location: 'Hyderabad', baseSalary: 85, bonus: 20, equity: 45, totalComp: 150, yearsExp: 12, yoe: 12, verified: true },
  ];

  // Add more entries to reach >60 entries
  for(let i = 0; i < 40; i++) {
    const comp = [google, amazon, flipkart, swiggy, zepto, microsoft][i % 6];
    const lvl = [2, 3, 4, 5][i % 4];
    let base = 10 + lvl * 10 + (Math.random() * 10);
    salariesData.push({
      companyId: comp.id,
      role: 'Software Engineer',
      internalLevel: 'AutoLevel',
      standardLevel: lvl,
      location: ['Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune'][i % 5],
      baseSalary: Number(base.toFixed(2)),
      bonus: Number((base * 0.1).toFixed(2)),
      equity: Number((lvl * 5).toFixed(2)),
      totalComp: Number((base + (base * 0.1) + (lvl * 5)).toFixed(2)),
      yearsExp: lvl * 2,
      yoe: lvl * 2,
      verified: Math.random() > 0.5
    });
  }

  for (const sData of salariesData) {
    await prisma.salaryEntry.create({
      data: sData
    });
  }

  console.log(`Seeded ${companiesData.length} companies and ${salariesData.length} salary entries.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
