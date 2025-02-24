"use client";
import { endRoom } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LogOut, X } from "lucide-react";
import { FC } from "react";
type EndSteamProps = {
  room: string;
  id: string;
  isCreator: boolean;
};
const EndSteam: FC<EndSteamProps> = ({ room, id, isCreator }) => {
  return (
    <div className="flex w-fit gap-2">
      {isCreator && (
        <Button
          className="bg-red-500 text-white gap-2"
          onClick={() => endRoom(room, id)}
          size="sm"
        >
          End Room
          <X className="h-3 w-3" />
        </Button>
        
      )}
      <Button className="bg-blue-400 text-white gap-2" size="sm">
        Leave Stream
        <LogOut className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EndSteam;
