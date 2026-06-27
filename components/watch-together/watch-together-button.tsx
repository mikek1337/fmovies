"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Tv, Users } from "lucide-react";

interface WatchTogetherButtonProps {
  isInRoom: boolean;
  isActive: boolean;
  onClick: () => void;
}

const WatchTogetherButton: FC<WatchTogetherButtonProps> = ({ isInRoom, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isActive && !isInRoom}
      className={`gap-2 transition-all duration-200 ${
        isInRoom
          ? "bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 hover:bg-formovies-gold/30"
          : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
      }`}
    >
      {isInRoom ? <Users className="size-4" /> : <Tv className="size-4" />}
      <span className="text-xs font-semibold uppercase tracking-wider">
        {isInRoom ? "In Watch Party" : "Watch Together"}
      </span>
    </Button>
  );
};

export default WatchTogetherButton;
