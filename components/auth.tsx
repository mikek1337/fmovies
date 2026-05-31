"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Auth = () => {
  const { data: session } = useSession();
  if (session) {
    const initials = session.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
    return (
      <Link href="/home/user">
        <Avatar className="size-8 ring-1 ring-formovies-gold/30 ring-offset-1 ring-offset-formovies-dark transition-all duration-300 hover:ring-formovies-gold/60">
          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
          <AvatarFallback className="bg-formovies-gold/10 text-formovies-gold text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link
        className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
        href="/signup"
      >
        Sign Up
      </Link>
      <Link
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-formovies-gold text-formovies-dark hover:bg-formovies-amber transition-colors duration-200"
        href="/signin"
      >
        Login
      </Link>
    </div>
  );
};

export default Auth;
