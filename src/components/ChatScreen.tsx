import { ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send, X, Search as SearchIcon, ArrowDown } from "lucide-react";
import { chats, contacts, type Chat, type Message } from "@/data/mockData";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import ChatInfoPanel from "@/components/ChatInfoPanel";
import ChatMenuDropdown from "@/components/ChatMenuDropdown";
import AttachmentModal from "@/components/AttachmentModal";
import MessageBubble from "@/components/MessageBubble";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { getChatFromFirestore, addMessageToChat } from "@/lib/firebaseService";
import { db } from "@/lib/firebase";

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
  onUpdateChat?: (updatedChat: Chat) => void;
}

// Forward picker overlay
function ForwardPicker({ onSelect, onClose }: { onSelect: (contactId: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col animate-slide-up">
      <div className="wa-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary/20"><X className="w-5 h-5" /></button>
        <h2 className="font-semibold text-lg">Forward to...</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.status}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Wallpaper picker overlay
const wallpaperColors = [
  "hsl(33, 23%, 88%)", "hsl(200, 20%, 90%)", "hsl(145, 20%, 88%)", "hsl(280, 15%, 90%)",
  "hsl(20, 25%, 88%)", "hsl(350, 20%, 90%)", "hsl(60, 15%, 90%)", "hsl(0, 0%, 92%)",
  "hsl(210, 30%, 20%)", "hsl(168, 30%, 25%)", "hsl(0, 0%, 15%)", "hsl(280, 20%, 20%)",
];

function WallpaperPicker({ current, onSelect, onClose }: { current: string; onSelect: (c: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-up">
      <div className="wa-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="font-semibold text-lg">Chat wallpaper</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-muted-foreground mb-4">Choose a wallpaper color</p>
        <div className="grid grid-cols-4 gap-3">
          {wallpaperColors.map((color, i) => (
            <button key={i} onClick={() => { onSelect(color); onClose(); }}
              className={`w-full aspect-square rounded-xl border-2 transition-all ${current === color ? "border-wa-teal scale-95" : "border-transparent"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button onClick={() => { onSelect("hsl(33, 23%, 88%)"); onClose(); }}
          className="mt-4 w-full py-3 text-sm text-wa-teal font-medium rounded-xl bg-secondary hover:bg-secondary/80">
          Reset to default
        </button>
      </div>
    </div>
  );
}

// Starred messages overlay
function StarredMessages({ messages, onClose }: { messages: Message[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-up">
      <div className="wa-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="font-semibold text-lg">Starred messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-sm">No starred messages</p>
            <p className="text-xs text-muted-foreground mt-1">Long press a message and tap star to save it here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`px-3 py-2 rounded-lg ${m.senderId === "me" ? "bg-wa-bubble-out ml-8" : "bg-wa-bubble-in mr-8"}`}>
                <p className="text-sm text-foreground">{m.text}</p>
                <p className="text-[10px] text-wa-time mt-1">{m.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Contact picker for sharing
function ContactPicker({ onSelect, onClose }: { onSelect: (contact: { name: string; phone: string }) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-up">
      <div className="wa-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary/20"><X className="w-5 h-5" /></button>
        <h2 className="font-semibold text-lg">Send contact</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map(c => (
          <button key={c.id} onClick={() => onSelect({ name: c.name, phone: c.phone })}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.phone}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Block confirmation dialog
function BlockConfirmDialog({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl p-5 shadow-2xl animate-scale-in max-w-sm mx-auto">
        <h3 className="font-semibold text-foreground mb-2">Block {name}?</h3>
        <p className="text-sm text-muted-foreground mb-5">Blocked contacts will no longer be able to call you or send you messages.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg">Block</button>
        </div>
      </div>
    </>
  );
}

export default function ChatScreen({ chatId, onBack, onUpdateChat }: ChatScreenProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [muted, setMuted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);
  const [replyMap, setReplyMap] = useState<Record<string, Message>>({});
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForward, setShowForward] = useState<Message | null>(null);
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [wallpaper, setWallpaper] = useState("hsl(33, 23%, 88%)");
  const [showStarred, setShowStarred] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileAccept, setFileAccept] = useState("");
  const { settings } = useSettings();

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const firestoreChat: Chat = {
          id: snapshot.id,
          contact: data.contact as Chat["contact"],
          unread: data.unread ?? 0,
          pinned: data.pinned ?? false,
          muted: data.muted ?? false,
          messages: (data.messages as Message[]) ?? [],
        };
        setChat(firestoreChat);
        setMessages(firestoreChat.messages);
        setMuted(firestoreChat.muted);
      } else {
        const fallback = chats.find(c => c.id === chatId);
        if (fallback) {
          setChat(fallback);
          setMessages(fallback.messages);
          setMuted(fallback.muted);
        }
      }
    }, error => {
      console.error("Chat subscription error:", error);
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

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

  const sendSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent" as const,
      type: "text" as const,
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !chat) return;
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

    try {
      await addMessageToChat(chat.id, newMsg);
      const updatedChat = chat ? { ...chat, messages: [...chat.messages, newMsg] } : chat;
      if (updatedChat) {
        setChat(updatedChat);
        onUpdateChat?.(updatedChat);
      }
    } catch (error) {
      console.error("Failed to save message to Firestore:", error);
      toast.error("Unable to save message to backend");
    }
  };

  const handleReply = (msg: Message) => setReplyingTo(msg);
  const handleEdit = (msg: Message) => { setEditingMsg(msg); setInput(msg.text); };
  const handleDelete = (msgId: string) => setMessages(prev => prev.filter(m => m.id !== msgId));
  const handleUnsend = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: "🚫 This message was deleted" } : m));
    toast.success("Message unsent");
  };
  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); };
  const handleStar = (msgId: string) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) { next.delete(msgId); toast.success("Unstarred"); }
      else { next.add(msgId); toast.success("Starred ⭐"); }
      return next;
    });
  };
  const handleForward = (msg: Message) => setShowForward(msg);
  const handleForwardTo = (contactId: string) => {
    const target = contacts.find(c => c.id === contactId);
    toast.success(`Forwarded to ${target?.name}`);
    setShowForward(null);
  };

  const handleAttachment = (type: string) => {
    switch (type) {
      case "image":
        setFileAccept("image/*");
        setTimeout(() => fileInputRef.current?.click(), 100);
        break;
      case "video":
        setFileAccept("video/*");
        setTimeout(() => fileInputRef.current?.click(), 100);
        break;
      case "document":
        setFileAccept("*/*");
        setTimeout(() => fileInputRef.current?.click(), 100);
        break;
      case "location":
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              sendSystemMessage(`📍 Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\nhttps://maps.google.com/?q=${latitude},${longitude}`);
              toast.success("Location shared");
            },
            () => toast.error("Location access denied")
          );
        } else {
          toast.error("Geolocation not supported");
        }
        break;
      case "contact":
        setShowContactPicker(true);
        break;
      case "gif":
        sendSystemMessage("🎞️ [GIF]");
        toast.success("GIF sent");
        break;
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const emoji = isImage ? "📷" : isVideo ? "🎥" : "📄";
    const sizeKB = (file.size / 1024).toFixed(0);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
    sendSystemMessage(`${emoji} ${file.name} (${sizeStr})`);
    toast.success(`${isImage ? "Image" : isVideo ? "Video" : "File"} sent`);
    e.target.value = "";
  };

  const handleShareContact = (contact: { name: string; phone: string }) => {
    sendSystemMessage(`👤 Contact: ${contact.name}\n📞 ${contact.phone}`);
    setShowContactPicker(false);
    toast.success("Contact shared");
  };

  // Search filtering
  const searchResults = searchQuery.trim()
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const starredMessages = messages.filter(m => starredIds.has(m.id));

  return (
    <div className="flex flex-col h-full animate-slide-up relative">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept={fileAccept} className="hidden" onChange={handleFileSelected} />

      {/* Search bar */}
      {showSearch ? (
        <div className="wa-header px-3 pt-10 pb-2 flex items-center gap-2 relative z-10">
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="p-1.5 rounded-full hover:bg-primary/20">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search in chat..."
            className="flex-1 bg-transparent text-sm outline-none text-wa-header-foreground placeholder:text-wa-header-foreground/50"
          />
          {searchQuery && (
            <span className="text-xs text-wa-header-foreground/70">{searchResults.length} found</span>
          )}
        </div>
      ) : (
        <div className="wa-header px-2 pt-10 pb-2 flex items-center gap-2 relative z-10">
          <button onClick={onBack} className="p-1.5 -ml-1 rounded-full hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setShowInfo(true)} className="flex items-center gap-2 flex-1 min-w-0">
            <img src={chat.contact.avatar} alt="" className="w-9 h-9 rounded-full bg-muted" />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{chat.contact.name}</p>
              <p className="text-[11px] text-wa-header-foreground/70">
                {blocked ? "Blocked" : chat.contact.online ? "online" : `last seen ${chat.contact.lastSeen}`}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => toast.success(`Video calling ${chat.contact.name}...`)} className="p-2 rounded-full hover:bg-primary/20 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button onClick={() => toast.success(`Calling ${chat.contact.name}...`)} className="p-2 rounded-full hover:bg-primary/20 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button onClick={() => setShowMenu(true)} className="p-2 rounded-full hover:bg-primary/20 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3-dot menu dropdown */}
      <ChatMenuDropdown
        open={showMenu}
        onClose={() => setShowMenu(false)}
        muted={muted}
        onToggleMute={() => { setMuted(m => !m); toast.success(muted ? "Unmuted" : "Muted"); }}
        onViewContact={() => setShowInfo(true)}
        onSearch={() => setShowSearch(true)}
        onClearChat={() => { setMessages([]); toast.success("Chat cleared"); }}
        onWallpaper={() => setShowWallpaper(true)}
        onStarred={() => setShowStarred(true)}
        onBlock={() => setShowBlockConfirm(true)}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide" style={{
        backgroundColor: wallpaper,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        <div className="max-w-lg mx-auto space-y-1.5">
          {(showSearch && searchQuery ? searchResults : messages).map(msg => (
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
              starred={starredIds.has(msg.id)}
              highlight={showSearch ? searchQuery : undefined}
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
          <button className="p-1 flex-shrink-0" onClick={() => {
            const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "😍", "🙏", "💪", "✨"];
            setInput(prev => prev + emojis[Math.floor(Math.random() * emojis.length)]);
          }}>
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
            placeholder={blocked ? "You blocked this contact" : "Type a message"}
            rows={1}
            disabled={blocked}
            className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-1 max-h-24 disabled:opacity-50"
          />
          <button onClick={() => setShowAttach(prev => !prev)} className="p-1 flex-shrink-0">
            <Paperclip className="w-5 h-5 text-muted-foreground rotate-45" />
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={blocked}
          className="w-11 h-11 bg-wa-teal rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {input.trim() ? (
            <Send className="w-5 h-5 text-wa-header-foreground" />
          ) : (
            <Mic className="w-5 h-5 text-wa-header-foreground" />
          )}
        </button>
      </div>

      {/* Overlays */}
      {showForward && <ForwardPicker onSelect={handleForwardTo} onClose={() => setShowForward(null)} />}
      {showWallpaper && <WallpaperPicker current={wallpaper} onSelect={setWallpaper} onClose={() => setShowWallpaper(false)} />}
      {showStarred && <StarredMessages messages={starredMessages} onClose={() => setShowStarred(false)} />}
      {showContactPicker && <ContactPicker onSelect={handleShareContact} onClose={() => setShowContactPicker(false)} />}
      {showBlockConfirm && (
        <BlockConfirmDialog
          name={chat.contact.name}
          onConfirm={() => { setBlocked(true); toast.success(`${chat.contact.name} blocked`); }}
          onClose={() => setShowBlockConfirm(false)}
        />
      )}
    </div>
  );
}
