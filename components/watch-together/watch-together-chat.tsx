"use client";
import { FC, useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import { ChatMessage } from "@/hooks/useWatchTogetherChat";

interface WatchTogetherChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const WatchTogetherChat: FC<WatchTogetherChatProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <MessageCircle className="size-4 text-formovies-gold" />
        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Chat</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-xs text-white/30 text-center py-8">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="size-6 rounded-full bg-formovies-gold/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-formovies-gold">
                {msg.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-white/80 truncate max-w-[120px]">
                  {msg.userName}
                </span>
                <span className="text-[10px] text-white/30">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-xs text-white/60 break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/30 focus:outline-none focus:border-formovies-gold/50 transition-colors"
        />
        <button
          type="submit"
          className="size-8 rounded-lg bg-formovies-gold/20 text-formovies-gold hover:bg-formovies-gold/30 flex items-center justify-center transition-colors shrink-0"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  );
};

export default WatchTogetherChat;
