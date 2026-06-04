import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CompanyClient } from './CompanyClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Fetch company name to set dynamic SEO
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true, industry: true }
  });

  if (!company) {
    return {
      title: "Company Not Found | CompIntel"
    };
  }

  return {
    title: `${company.name} Salary, Equity, and Bonus Data | CompIntel`,
    description: `Explore verified compensation data for ${company.name} across all standard levels. See how base salary, bonuses, and equity scale with years of experience.`,
    keywords: [`${company.name} salary`, `${company.name} compensation`, `${company.name} levels`, `tech salaries`, `CompIntel`],
    openGraph: {
      title: `${company.name} Salary Data in India | CompIntel`,
      description: `View total compensation by level for ${company.name}.`,
    }
  };
}

export default async function CompanyDetailPage() {
  return <CompanyClient />;
}
