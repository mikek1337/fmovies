import { FC } from "react";

interface UserDashboardProps {
  userSession: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
  stats: {
    viewed: number;
    watchlist: number;
  };
}

const UserDashboard: FC<UserDashboardProps> = ({ userSession, stats }) => {
  const initials = userSession.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-formovies-surface/80 via-formovies-dark to-formovies-deeper border border-white/5 mb-10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-formovies-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-formovies-rose/5 rounded-full blur-3xl" />

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-formovies-gold/20 flex items-center justify-center border border-formovies-gold/30">
            <span className="font-display text-2xl text-formovies-gold">{initials}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white">
              Welcome back, <span className="text-formovies-gold">{userSession.name?.split(" ")[0] || "Viewer"}</span>
            </h1>
            <p className="text-white/40 font-body text-sm mt-1">Your ForMovies awaits</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="font-display text-2xl text-formovies-gold">{stats.viewed}</p>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mt-0.5">Watched</p>
            </div>
            <div className="text-center px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="font-display text-2xl text-formovies-gold">{stats.watchlist}</p>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mt-0.5">Watchlist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
