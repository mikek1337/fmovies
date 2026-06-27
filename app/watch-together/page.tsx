import { redirect } from "next/navigation";

export default async function WatchTogetherRedirect({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  if (!room) {
    redirect("/");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/watch/room/${room}`, { cache: "no-store" });
    if (!res.ok) {
      redirect("/");
    }
    const data = await res.json();

    if (data.mediaType === "tv") {
      const season = data.season || 1;
      const episode = data.episode || 1;
      redirect(`/home/watch/series/${data.mediaId}?room=${room}&season=${season}&episode=${episode}`);
    } else {
      redirect(`/home/watch/movie/${data.mediaId}?room=${room}`);
    }
  } catch {
    redirect("/");
  }
}
