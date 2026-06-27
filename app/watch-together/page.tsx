import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function WatchTogetherRedirect({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  if (!room) {
    redirect("/");
  }

  const data = await db.watchRoom.findUnique({ where: { id: room } });
  if (!data || !data.isActive) {
    redirect("/");
  }

  if (data.mediaType === "tv") {
    const season = data.season || 1;
    const episode = data.episode || 1;
    redirect(`/home/watch/series/${data.mediaId}?room=${room}&season=${season}&episode=${episode}`);
  } else {
    redirect(`/home/watch/movie/${data.mediaId}?room=${room}`);
  }
}
