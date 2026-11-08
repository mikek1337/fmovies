"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Settings,
  Film,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push("/signin");
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (session?.user) {
    const initials =
      session.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none group focus:outline-none">
          <Avatar className="size-9 ring-1 ring-formovies-gold/40 ring-offset-2 ring-offset-formovies-dark transition-all duration-300 group-hover:ring-formovies-gold group-hover:scale-105 cursor-pointer shadow-lg shadow-formovies-gold/10">
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-formovies-gold/15 text-formovies-gold text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 p-2 bg-[#0c0d14]/95 border border-white/10 text-white backdrop-blur-2xl rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 z-50"
        >
          {/* User Profile Header */}
          <DropdownMenuLabel className="p-3 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 ring-1 ring-formovies-gold/30 shrink-0">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || "User"}
                />
                <AvatarFallback className="bg-formovies-gold/20 text-formovies-gold text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user?.name || "Viewer"}
                  </p>
                  <Sparkles className="size-3 text-formovies-gold shrink-0" />
                </div>
                <p className="text-xs text-white/40 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-white/10 my-1" />

          {/* Navigation Items */}
          <DropdownMenuItem asChild>
            <Link
              href="/home/user"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Film className="size-4 text-formovies-gold" />
              <span>Dashboard & Watchlist</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/home/user/account"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Settings className="size-4 text-white/50" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/10 my-1" />

          {/* Sign Out Item */}
          <DropdownMenuItem
            disabled={isLoggingOut}
            onSelect={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-colors cursor-pointer focus:bg-red-500/15 focus:text-red-300"
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 animate-spin text-red-400" />
            ) : (
              <LogOut className="size-4 text-red-400" />
            )}
            <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
        href="/signup"
      >
        Sign Up
      </Link>
      <Link
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-formovies-gold text-formovies-dark hover:bg-formovies-amber transition-all duration-200 shadow-sm shadow-formovies-gold/20"
        href="/signin"
      >
        Sign In
      </Link>
    </div>
  );
};

export default Auth;
