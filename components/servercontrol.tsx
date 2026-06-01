"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Server } from "lucide-react";
import { FC, useState } from "react";

interface ServerControlProps {
    selectServer: (serverUrl: string) => void,
}

const ServerControl: FC<ServerControlProps> = ({ selectServer }) => {
    const servers = ["vidsrc.ru", "vidlink.pro", "vidsrc.icu", "vidsrc-embed.ru"]
    const [selectedServer, setSelectedServer] = useState<string>(servers[0])

    const changeServer = (server: string) => {
        setSelectedServer(server)
        selectServer(server)
    }

    const serverLabels: Record<string, string> = {
        "vidsrc.ru": "VidSrc",
        "vidlink.pro": "VidLink",
        "vidsrc.icu": "VidSrc Alt",
        "vidsrc-embed.ru": "VidSrc Embed",
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Server className="size-4 text-white/40" />
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Servers:</span>
            <div className="flex flex-wrap gap-2">
                {servers.map((server) => (
                    <Button
                        key={server}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "text-xs font-medium transition-all duration-200",
                            selectedServer === server
                                ? "bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30"
                                : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                        )}
                        onClick={() => changeServer(server)}
                    >
                        {serverLabels[server] || server}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ServerControl;
