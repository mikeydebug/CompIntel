import Link from "next/link";
import { AuthButton } from "./AuthButton";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500 text-white">
            <span className="font-bold">C</span>
          </div>
          <span>CompIntel</span>
        </Link>

        <div className="mx-auto hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/salaries" className="hover:text-zinc-100 transition-colors">
            Salaries
          </Link>
          <Link href="/companies" className="hover:text-zinc-100 transition-colors">
            Companies
          </Link>
          <Link href="/compare" className="hover:text-zinc-100 transition-colors">
            Compare
          </Link>
          <Link href="/admin" className="hover:text-zinc-100 transition-colors">
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <Link
            href="/submit"
            className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 h-9 px-4 py-2"
          >
            Add Salary
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
