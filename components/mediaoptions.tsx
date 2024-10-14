import { Heart, PlayCircle } from "lucide-react";
import { Button } from "./ui/button"

const MediaOptions = () =>{
    return(
        <div className="flex flex-col gap-3 md:my-0 my-10">
            <Button variant={"ghost"} className="text-indigo-600 flex items-center gap-2 border md:border-0">
                <Heart className="w-5 h-5"/>
                Add to Watchlist
            </Button>
            <Button className="bg-indigo-600 text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5"/>
                Watch Together
            </Button>
        </div>
    )
}

export default MediaOptions;