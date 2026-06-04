export function inferLevel(yearsExp: number): number {
  if (yearsExp < 2) return 2; // Junior
  if (yearsExp < 4) return 3; // Mid
  if (yearsExp < 7) return 4; // Senior
  if (yearsExp < 10) return 5; // Staff
  return 6; // Principal/Director
}

export function levelColor(level: number): string {
  switch (level) {
    case 1:
    case 2:
      return 'bg-zinc-800 text-zinc-300 ring-zinc-700';
    case 3:
      return 'bg-blue-900/50 text-blue-300 ring-blue-800';
    case 4:
      return 'bg-indigo-900/50 text-indigo-300 ring-indigo-800';
    case 5:
      return 'bg-purple-900/50 text-purple-300 ring-purple-800';
    case 6:
      return 'bg-amber-900/50 text-amber-300 ring-amber-800';
    case 7:
    case 8:
      return 'bg-red-900/50 text-red-300 ring-red-800';
    default:
      return 'bg-zinc-800 text-zinc-300 ring-zinc-700';
  }
}

export function levelLabel(level: number): string {
  return `L${level}`;
}
