'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse bg-zinc-800 rounded-md"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
          )}
          <span className="text-sm font-medium text-zinc-300 hidden md:inline-block">
            {session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm font-medium bg-zinc-100 text-zinc-900 px-4 py-2 rounded-md hover:bg-white transition-colors"
    >
      Sign In
    </button>
  );
}
