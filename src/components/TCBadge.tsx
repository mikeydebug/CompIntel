import { formatTC } from '@/lib/format';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TCBadge({ amount, className }: { amount: number, className?: string }) {
  let colorClass = 'bg-zinc-800 text-zinc-300 ring-zinc-700'; // Default gray
  
  if (amount >= 100) {
    colorClass = 'bg-emerald-900/50 text-emerald-400 ring-emerald-800/50';
  } else if (amount >= 50) {
    colorClass = 'bg-indigo-900/50 text-indigo-400 ring-indigo-800/50';
  } else if (amount >= 30) {
    colorClass = 'bg-amber-900/50 text-amber-400 ring-amber-800/50';
  }

  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset', colorClass, className)}>
      {formatTC(amount)}
    </span>
  );
}
