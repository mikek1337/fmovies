import Chat from "@/components/chat";
import VideoPlayer from "@/components/videoplayer";

const Page = ({params}:{params:{room:string, id:string}})=>{
    const {room, id} = params;
    if(!id || !room) return <></>;

    return(
       <div className="flex gap-2 w-full">
        <div>
            <VideoPlayer videoUrl=""/>
        </div>
        <div>
            <Chat room={room}/>
        </div>
       </div>
    )
}

export default Page;