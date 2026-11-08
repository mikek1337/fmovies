"use client";

import { cn } from "@/lib/utils";
import { Server } from "lucide-react";
import { FC, useState } from "react";

interface ServerControlProps {
  selectServer: (serverUrl: string) => void;
  currentServer?: string;
}

const servers = [
  { id: "vidsrc.ru", name: "VidSrc", tag: "Primary" },
  { id: "vidlink.pro", name: "VidLink", tag: "Fast" },
  { id: "vidsrc.icu", name: "VidSrc Alt", tag: "HD" },
  { id: "vidsrc-embed.ru", name: "VidSrc Embed", tag: "Multi" },
  { id: "embed.su", name: "EmbedSu", tag: "Backup" },
];

const ServerControl: FC<ServerControlProps> = ({ selectServer, currentServer }) => {
  const [selectedServer, setSelectedServer] = useState<string>(
    currentServer || servers[0].id
  );

  const changeServer = (serverId: string) => {
    setSelectedServer(serverId);
    selectServer(serverId);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-2">
        <Server className="size-4 text-formovies-gold shrink-0" />
        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
          Streaming Server:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {servers.map((server) => {
          const isSelected = selectedServer === server.id;
          return (
            <button
              key={server.id}
              type="button"
              onClick={() => changeServer(server.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-formovies-gold/20 text-formovies-gold border-formovies-gold/40 shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/5"
              )}
            >
              {isSelected && (
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span>{server.name}</span>
              <span
                className={cn(
                  "text-[10px] px-1 rounded",
                  isSelected
                    ? "bg-formovies-gold/30 text-formovies-gold"
                    : "bg-white/10 text-white/40"
                )}
              >
                {server.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServerControl;
