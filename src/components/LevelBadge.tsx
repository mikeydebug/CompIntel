import { levelColor, levelLabel } from '@/lib/level';
import { cn } from '@/lib/utils';

export function LevelBadge({ level, internalLevel, className }: { level: number, internalLevel?: string, className?: string }) {
  const colorClass = levelColor(level);
  const label = levelLabel(level);

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset', colorClass, className)}>
      <span>{label}</span>
      {internalLevel && (
        <span className="opacity-70 before:content-['•'] before:mr-1.5">
          {internalLevel}
        </span>
      )}
    </span>
  );
}
