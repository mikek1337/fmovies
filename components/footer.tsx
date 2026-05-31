import { FC } from "react";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <footer className="border-t border-white/5 bg-formovies-deeper mt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Clapperboard className="size-5 text-formovies-gold" />
              <span className="font-display text-xl tracking-widest text-white">ForMovies</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Your ultimate destination for streaming movies and TV series. Discover, watch, and enjoy.
            </p>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Browse</h4>
            <ul className="space-y-2">
              <li><Link href="/home/movies" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Movies</Link></li>
              <li><Link href="/home/series" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">TV Series</Link></li>
              <li><Link href="/home" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Trending</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/signin" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Sign In</Link></li>
              <li><Link href="/signup" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Sign Up</Link></li>
              <li><Link href="/home/user" className="text-white/40 text-sm hover:text-formovies-gold transition-colors duration-200">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} ForMovies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
