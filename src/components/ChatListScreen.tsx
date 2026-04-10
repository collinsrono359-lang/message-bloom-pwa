import { Search, MoreVertical, Pin, VolumeX, Check, CheckCheck } from "lucide-react";
import { type Chat } from "@/data/mockData";
import { useState } from "react";

interface ChatListScreenProps {
  chats: Chat[];
  onOpenChat: (chatId: string) => void;
}

export default function ChatListScreen({ chats, onOpenChat }: ChatListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = chats.filter(c =>
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const lastMsg = (chat: Chat) => chat.messages[chat.messages.length - 1] ?? {
    id: "",
    senderId: "",
    text: "No messages yet",
    timestamp: "",
    status: "sent" as const,
    type: "text" as const,
  };

  const TickIcon = ({ status }: { status: string }) => {
    if (status === "sent") return <Check className="w-4 h-4 text-wa-tick" />;
    if (status === "delivered") return <CheckCheck className="w-4 h-4 text-wa-tick" />;
    return <CheckCheck className="w-4 h-4 text-wa-tick-read" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">ChatApp</h1>
          <button className="p-1 rounded-full hover:bg-primary/20 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wa-header-foreground/60" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-primary/20 text-wa-header-foreground placeholder:text-wa-header-foreground/50 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:bg-primary/30 transition-colors"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No chats available.
          </div>
        ) : sorted.map(chat => {
          const last = lastMsg(chat);
          const isSent = last.senderId === "me";
          return (
            <button
              key={chat.id}
              onClick={() => onOpenChat(chat.id)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/50"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img src={chat.contact.avatar} alt="" className="w-12 h-12 rounded-full bg-muted" />
                {chat.contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-wa-green rounded-full border-2 border-card" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[15px] text-foreground truncate flex items-center gap-1">
                    {chat.contact.name}
                    {chat.pinned && <Pin className="w-3 h-3 text-muted-foreground rotate-45" />}
                    {chat.muted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
                  </span>
                  <span className={`text-xs flex-shrink-0 ${chat.unread > 0 ? "text-wa-green font-semibold" : "text-wa-time"}`}>
                    {last.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    {isSent && <TickIcon status={last.status} />}
                    {last.text}
                  </span>
                  {chat.unread > 0 && (
                    <span className="bg-wa-badge text-accent-foreground text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 ml-2">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-40">
        <MessageIcon />
      </button>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-accent-foreground">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z" />
    </svg>
  );
}
