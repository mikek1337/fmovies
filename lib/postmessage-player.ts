type PlayerCommand = "play" | "pause";
type PlayerCommandWithPayload = { command: "seek"; time: number } | { command: "volume"; level: number } | { command: "getStatus" };

export type VidFastCommand =
  | PlayerCommand
  | PlayerCommandWithPayload;

export type PlayerEventType = "play" | "pause" | "seeked" | "ended" | "timeupdate";

export interface PlayerEventData {
  event: PlayerEventType;
  currentTime: number;
  duration: number;
  mtmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

const VIDFAST_ORIGINS = ["https://vidfast.pro", "https://vidfast.net"];

export function sendCommandToPlayer(
  iframe: HTMLIFrameElement | null,
  command: VidFastCommand
): void {
  if (!iframe?.contentWindow) return;
  if (typeof command === "string") {
    iframe.contentWindow.postMessage({ command }, "*");
  } else {
    iframe.contentWindow.postMessage(command, "*");
  }
}

export function createPlayerCommand(command: VidFastCommand): VidFastCommand {
  return command;
}

export function isValidVidFastOrigin(origin: string): boolean {
  return VIDFAST_ORIGINS.includes(origin);
}

export function isPlayerEvent(data: unknown): data is { type: "PLAYER_EVENT"; data: PlayerEventData } {
  if (!data || typeof data !== "object") return false;
  const msg = data as Record<string, unknown>;
  return msg.type === "PLAYER_EVENT" && msg.data !== null && typeof msg.data === "object";
}
