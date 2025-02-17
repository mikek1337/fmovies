import Chat from "@/components/chat";
import VideoServerController from "@/components/videoservercontroller";

const Page = async ({params}:{params:{room:string, id:string}})=>{
    const {room, id} = params;
    if(!id || !room) return <></>;
    return(
       <div className="flex gap-1 w-full px-10">
        <div className="w-full">
        <VideoServerController mediaType="movie" additionalParams={id}/>

        </div>
        <div className="w-[30%]">
            <Chat room={room}/>
        </div>
       </div>
    )
}

export default Page;