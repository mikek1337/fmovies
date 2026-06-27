"use client";
import { FC, useState } from "react";
import { Link, Check, Copy } from "lucide-react";

interface WatchTogetherInviteProps {
  roomId: string;
}

const WatchTogetherInvite: FC<WatchTogetherInviteProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/watch-together?room=${roomId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Link className="size-3.5 text-formovies-gold" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Invite Link</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 truncate focus:outline-none"
        />
        <button
          onClick={copyLink}
          className="size-8 rounded-lg bg-formovies-gold/20 text-formovies-gold hover:bg-formovies-gold/30 flex items-center justify-center transition-colors shrink-0"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default WatchTogetherInvite;
