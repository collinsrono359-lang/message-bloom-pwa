import { ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send, X } from "lucide-react";
import { chats, type Message } from "@/data/mockData";
import { useState, useRef, useEffect } from "react";
import ChatInfoPanel from "@/components/ChatInfoPanel";
import ChatMenuDropdown from "@/components/ChatMenuDropdown";
import AttachmentModal from "@/components/AttachmentModal";
import MessageBubble from "@/components/MessageBubble";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
}

export default function ChatScreen({ chatId, onBack }: ChatScreenProps) {
  const chat = chats.find(c => c.id === chatId);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(chat?.messages ?? []);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [muted, setMuted] = useState(chat?.muted ?? false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);
  const [replyMap, setReplyMap] = useState<Record<string, Message>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) return null;

  if (showInfo) {
    return (
      <ChatInfoPanel
        contact={chat.contact}
        onClose={() => setShowInfo(false)}
        muted={muted}
        onToggleMute={() => setMuted(m => !m)}
      />
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;

    if (editingMsg) {
      setMessages(prev => prev.map(m => m.id === editingMsg.id ? { ...m, text: input.trim() } : m));
      setEditingMsg(null);
      setInput("");
      return;
    }

    const newId = `new-${Date.now()}`;
    const newMsg: Message = {
      id: newId,
      senderId: "me",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent" as const,
      type: "text" as const,
    };

    if (replyingTo) {
      setReplyMap(prev => ({ ...prev, [newId]: replyingTo }));
      setReplyingTo(null);
    }

    setMessages(prev => [...prev, newMsg]);
    setInput("");
  };

  const handleReply = (msg: Message) => setReplyingTo(msg);
  const handleEdit = (msg: Message) => { setEditingMsg(msg); setInput(msg.text); };
  const handleDelete = (msgId: string) => setMessages(prev => prev.filter(m => m.id !== msgId));
  const handleUnsend = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: "🚫 This message was deleted" } : m));
    toast.success("Message unsent");
  };
  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); };
  const handleStar = (msgId: string) => toast.success("Message starred");
  const handleForward = (msg: Message) => toast.info("Forward: coming soon");
  const handleAttachment = (type: string) => {
    toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} picker will open here`);
  };

  return (
    <div className="flex flex-col h-full animate-slide-up relative">
      {/* Header */}
      <div className="wa-header px-2 pt-10 pb-2 flex items-center gap-2 relative z-10">
        <button onClick={onBack} className="p-1.5 -ml-1 rounded-full hover:bg-primary/20 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setShowInfo(true)} className="flex items-center gap-2 flex-1 min-w-0">
          <img src={chat.contact.avatar} alt="" className="w-9 h-9 rounded-full bg-muted" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{chat.contact.name}</p>
            <p className="text-[11px] text-wa-header-foreground/70">
              {chat.contact.online ? "online" : `last seen ${chat.contact.lastSeen}`}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-primary/20 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-primary/20 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button onClick={() => setShowMenu(true)} className="p-2 rounded-full hover:bg-primary/20 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3-dot menu dropdown */}
      <ChatMenuDropdown
        open={showMenu}
        onClose={() => setShowMenu(false)}
        muted={muted}
        onToggleMute={() => setMuted(m => !m)}
        onViewContact={() => setShowInfo(true)}
        onSearch={() => toast.info("Search in chat: coming soon")}
        onClearChat={() => { setMessages([]); toast.success("Chat cleared"); }}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 bg-wa-chat-bg scrollbar-hide" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        <div className="max-w-lg mx-auto space-y-1.5">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUnsend={handleUnsend}
              onCopy={handleCopy}
              onStar={handleStar}
              onForward={handleForward}
              replyTo={replyMap[msg.id]}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Reply / Edit bar */}
      {(replyingTo || editingMsg) && (
        <div className="bg-secondary px-4 py-2 flex items-center gap-3 border-t border-border/50">
          <div className="flex-1 border-l-4 border-wa-teal pl-2">
            <p className="text-xs font-semibold text-wa-teal">
              {editingMsg ? "Editing" : replyingTo?.senderId === "me" ? "You" : chat.contact.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{editingMsg?.text || replyingTo?.text}</p>
          </div>
          <button onClick={() => { setReplyingTo(null); setEditingMsg(null); setInput(""); }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Attachment modal */}
      <div className="relative">
        <AttachmentModal open={showAttach} onClose={() => setShowAttach(false)} onSelect={handleAttachment} />
      </div>

      {/* Input */}
      <div className="bg-card px-2 py-2 flex items-end gap-2 border-t border-border/50">
        <div className="flex-1 flex items-end bg-secondary rounded-3xl px-3 py-1.5">
          <button className="p-1 flex-shrink-0">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (settings.enterToSend && e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-1 max-h-24"
          />
          <button onClick={() => setShowAttach(prev => !prev)} className="p-1 flex-shrink-0">
            <Paperclip className="w-5 h-5 text-muted-foreground rotate-45" />
          </button>
        </div>
        <button
          onClick={handleSend}
          className="w-11 h-11 bg-wa-teal rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-shadow"
        >
          {input.trim() ? (
            <Send className="w-5 h-5 text-wa-header-foreground" />
          ) : (
            <Mic className="w-5 h-5 text-wa-header-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
