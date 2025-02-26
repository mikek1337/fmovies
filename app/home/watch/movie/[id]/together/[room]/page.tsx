import { ChatResponseWithoutCreatedAt } from "@/app/types/chat";
import Chat from "@/components/chat";
import EndSteam from "@/components/endstream";
import VideoServerController from "@/components/videoservercontroller";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import {socket} from '@/app/socket';
import { redirect } from "next/navigation";
const Page = async ({ params }: { params: { room: string; id: string } }) => {
  const { room, id } = params;
  const user = await getAuthSession();
  if(!user?.user)
      redirect(`/home/watch/movie/${id}`);
  const watchTogether = await db.watchTogether.upsert({
    where: {
      mediaId_roomId: {
        roomId: room,
        mediaId: id,
      },
      status: {
        not: "ENDED",
      },
    },
    create: {
      id: nanoid(),
      roomId: room,
      mediaId: id,
      MediaType: "movie",
      noOfParticipant: 1,
      status: "STARTED",
      User: {
        connect: {
          email: user?.user?.email || 'test',
        },
      },
    },
    update: {
      status: "INPROGRESS",
    },
    include: {
      User: true,
    },
  });

  const chatMessages = await db.chat.findMany({
    where: {
      roomId: room,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          image: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!id || !room) return <></>;
  return (
    <div className="flex gap-1 w-full px-10">
      <div className="w-full">
        <VideoServerController mediaType="movie" additionalParams={id} />
      </div>
      <div className="w-[30%]">
        <div className="flex w-full justify-between py-1 items-center">
          <span className="text-xs text-slate-500">
            {watchTogether.noOfParticipant > 1 ? "Viewers " : "Viewer "}
            {watchTogether.noOfParticipant}
          </span>
            <EndSteam id={id} room={room}  isCreator={watchTogether.User.email == user?.user?.email}/>
        </div>
        <Chat
          room={room}
          oldMessages={chatMessages as ChatResponseWithoutCreatedAt[]}
          mediaId={id}
        />
      </div>
    </div>
  );
};

export default Page;
