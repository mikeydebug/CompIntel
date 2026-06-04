import { Suspense } from 'react';
import { SalariesClient } from './SalariesClient';

export default function SalariesPage() {
  return (
    <div className="flex-1 bg-zinc-950">
      <Suspense fallback={<div className="p-8 text-center text-zinc-500 animate-pulse">Loading salaries data...</div>}>
        <SalariesClient />
      </Suspense>
    </div>
  );
}
