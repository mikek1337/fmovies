"use client";
import { FC } from "react";
import { Users, Crown } from "lucide-react";
import { RoomUser } from "@/hooks/useWatchTogether";

interface WatchTogetherUserListProps {
  users: RoomUser[];
  hostId: string;
}

const WatchTogetherUserList: FC<WatchTogetherUserListProps> = ({ users, hostId }) => {
  return (
    <div className="px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Users className="size-3.5 text-formovies-gold" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          Viewers ({users.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <div
            key={user.userId}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="size-5 rounded-full bg-formovies-gold/20 flex items-center justify-center">
              <span className="text-[9px] font-bold text-formovies-gold">
                {user.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-white/70 truncate max-w-[80px]">{user.userName}</span>
            {user.userId === hostId && <Crown className="size-3 text-formovies-gold shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchTogetherUserList;
