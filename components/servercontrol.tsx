"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Server } from "lucide-react";
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
        <div className="w-full  flex gap-2  py-10">
        <h3 className="text-lg font-semibold text-gray-800 mr-2">Alternative Streams:</h3>
        <div className="flex items-center gap-2">
            <Button variant="ghost" className={cn({"bg-indigo-500 text-white font-medium":selectedServer.includes(servers[0])})} onClick={()=>changeServer(servers[0])}>
                <Server className="w-5 h-5 mr-2" />
                VidSrc
            </Button>
            <Button variant="outline" className={cn({"bg-indigo-500 text-white":selectedServer.includes(servers[1])})} onClick={()=>changeServer(servers[1])}>
                <Server className="w-5 h-5 mr-2" />
                2Embed
                </Button>
        </div>
    </div>
    )
}
export default ServerControl;