export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    // Title Case
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Checks if a provided company name matches an existing company's slug, name, or aliases.
 */
export function isAliasMatch(providedName: string, company: { name: string; slug: string; aliases: string }): boolean {
  const normalizedProvided = providedName.toLowerCase().trim();
  if (normalizedProvided === company.name.toLowerCase() || normalizedProvided === company.slug) {
    return true;
  }
  
  try {
    const aliasesArray: string[] = JSON.parse(company.aliases || '[]');
    return aliasesArray.some(alias => alias.toLowerCase().trim() === normalizedProvided);
  } catch (e) {
    return false;
  }
}
