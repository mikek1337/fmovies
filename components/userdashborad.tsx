"use client";

import { FC, ReactNode } from "react";
import Image from "next/image";
import { Clock, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserDashboardProps {
  userSession: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  stats?: {
    viewed: number;
    watchlist: number;
  };
  activeTab?: "overview" | "watchlist" | "history";
  onTabChange?: (tab: "overview" | "watchlist" | "history") => void;
  children?: ReactNode;
}

const UserDashboard: FC<UserDashboardProps> = ({
  userSession,
  stats = { viewed: 0, watchlist: 0 },
  activeTab = "overview",
  onTabChange,
  children,
}) => {
  const initials =
    userSession.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-formovies-surface/90 via-formovies-dark to-[#090a0f] border border-white/10 mb-8 shadow-2xl">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-formovies-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-wrap">
          {/* User Avatar & Welcome Title */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden bg-formovies-gold/20 flex items-center justify-center border border-formovies-gold/30 shadow-lg shadow-formovies-gold/10 shrink-0">
              {userSession.image ? (
                <Image
                  src={userSession.image}
                  alt={userSession.name || "User"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <span className="font-display text-2xl sm:text-3xl text-formovies-gold">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/15 text-formovies-gold border border-formovies-gold/25">
                  Member
                </span>
                <span className="text-xs text-white/40 truncate">
                  {userSession.email}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide text-white mt-1 truncate">
                Welcome, {userSession.name || "Viewer"}
              </h1>
              <p className="text-white/40 font-body text-xs sm:text-sm mt-0.5">
                Track your watchlist, resume watching, and explore new entertainment.
              </p>
            </div>
          </div>

          {/* Interactive Stat Counters / Navigation Badges */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => onTabChange?.("watchlist")}
              className={cn(
                "flex-1 sm:flex-none text-left sm:text-center px-5 py-3 rounded-2xl border transition-all duration-200 group",
                activeTab === "watchlist"
                  ? "bg-formovies-gold/15 border-formovies-gold/40 text-formovies-gold"
                  : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 text-white"
              )}
            >
              <div className="flex items-center sm:justify-center gap-1.5 mb-0.5">
                <Bookmark className="size-3.5 text-formovies-gold" />
                <p className="font-display text-2xl leading-none">{stats.watchlist}</p>
              </div>
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">
                Watchlist
              </p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.("history")}
              className={cn(
                "flex-1 sm:flex-none text-left sm:text-center px-5 py-3 rounded-2xl border transition-all duration-200 group",
                activeTab === "history"
                  ? "bg-formovies-gold/15 border-formovies-gold/40 text-formovies-gold"
                  : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 text-white"
              )}
            >
              <div className="flex items-center sm:justify-center gap-1.5 mb-0.5">
                <Clock className="size-3.5 text-formovies-gold" />
                <p className="font-display text-2xl leading-none">{stats.viewed}</p>
              </div>
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">
                History
              </p>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        {onTabChange && (
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => onTabChange("overview")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shrink-0",
                activeTab === "overview"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-md shadow-formovies-gold/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Sparkles className="size-3.5" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("watchlist")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shrink-0",
                activeTab === "watchlist"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-md shadow-formovies-gold/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Bookmark className="size-3.5" />
              <span>My Watchlist</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-inherit font-bold">
                {stats.watchlist}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("history")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shrink-0",
                activeTab === "history"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-md shadow-formovies-gold/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Clock className="size-3.5" />
              <span>Watch History</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-inherit font-bold">
                {stats.viewed}
              </span>
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default UserDashboard;
