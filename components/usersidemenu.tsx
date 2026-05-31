"use client"
import { Bookmark, Compass, History, Settings, Film, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react"

const navItems = [
  { href: "/home/user", label: "Continue Watching", icon: History },
  { href: "/home/user", label: "Watch Later", icon: Bookmark },
  { href: "/home", label: "Explore", icon: Compass },
  { href: "/home/user/account", label: "Settings", icon: Settings },
];

const UserSideMenu: FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`glass-sidebar h-screen sticky top-0 transition-all duration-500 ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex flex-col h-full py-8 px-3">
        <Link href="/home/user" className="flex items-center gap-3 px-3 mb-10 group">
          <div className="w-10 h-10 rounded-xl bg-formovies-gold/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-formovies-gold" />
          </div>
          <span className={`font-display text-xl tracking-widest text-white transition-opacity duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
            ForMovies
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`glass-nav-item group ${isActive ? "active" : ""}`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? "text-formovies-gold" : ""}`} />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="glass-nav-item mt-auto justify-center"
        >
          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          <span className={`text-xs whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}

export default UserSideMenu;
