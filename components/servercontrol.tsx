"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

interface ServerControlProps{
    selectServer:(serverUrl:string)=>void,
}
const ServerControl:FC<ServerControlProps> = ({selectServer}) =>{
    const servers = ["vidsrc.icu", "2embed.org"]
    const[selectedServer, setSelectedServer] = useState<string>(servers[0])
    const changeServer = (server:string)=>{
        setSelectedServer(server)
        selectServer(server)
    }
    return(
        <div className="w-full flex flex-col items-center py-10">
        <h3 className="text-2xl font-semibold">Alternative Servers</h3>
        <div className="flex items-center gap-2">
            <Button variant="ghost" className={cn({"bg-indigo-500 text-white":selectedServer.includes(servers[0])})} onClick={()=>changeServer(servers[0])}>VidSrc</Button>
            <Button variant="ghost" className={cn({"bg-indigo-500 text-white":selectedServer.includes(servers[1])})} onClick={()=>changeServer(servers[1])}>2Embed</Button>
        </div>
    </div>
    )
}
export default ServerControl;