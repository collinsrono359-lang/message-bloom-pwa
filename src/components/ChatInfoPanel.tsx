import { ArrowLeft, Phone, Video, Search, Bell, BellOff, Star, Trash2, Ban, Image, FileText, Mic, ChevronRight, X } from "lucide-react";
import { type Contact } from "@/data/mockData";
import { useState } from "react";

interface ChatInfoPanelProps {
  contact: Contact;
  onClose: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export default function ChatInfoPanel({ contact, onClose, muted, onToggleMute }: ChatInfoPanelProps) {
  const [starredOpen, setStarredOpen] = useState(false);

  const mediaItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full animate-slide-up bg-card">
      {/* Header */}
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-primary/20">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Contact info</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Profile section */}
        <div className="flex flex-col items-center py-6 bg-card">
          <img src={contact.avatar} alt="" className="w-24 h-24 rounded-full bg-muted mb-3" />
          <h2 className="text-xl font-semibold text-foreground">{contact.name}</h2>
          <p className="text-sm text-muted-foreground">{contact.phone}</p>
          <p className="text-xs text-wa-green mt-1">
            {contact.online ? "online" : `last seen ${contact.lastSeen}`}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex justify-center gap-6 py-4 border-y border-border/50 bg-secondary/30">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm">
              <Phone className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-xs text-wa-teal">Audio</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm">
              <Video className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-xs text-wa-teal">Video</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm">
              <Search className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-xs text-wa-teal">Search</span>
          </button>
        </div>

        {/* About */}
        <div className="px-4 py-4 border-b border-border/50">
          <p className="text-xs text-muted-foreground mb-1">About</p>
          <p className="text-[15px] text-foreground">{contact.status}</p>
        </div>

        {/* Media, Links, Docs */}
        <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50">
          <span className="text-[15px] text-foreground">Media, links and docs</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">12</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-border/50">
          {mediaItems.map(i => (
            <div key={i} className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
              <Image className="w-6 h-6 text-muted-foreground/40" />
            </div>
          ))}
        </div>

        {/* Notifications */}
        <button onClick={onToggleMute} className="flex items-center gap-4 w-full px-4 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50">
          {muted ? <BellOff className="w-5 h-5 text-muted-foreground" /> : <Bell className="w-5 h-5 text-muted-foreground" />}
          <div className="flex-1 text-left">
            <p className="text-[15px] text-foreground">Mute notifications</p>
            <p className="text-xs text-muted-foreground">{muted ? "Muted" : "Not muted"}</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${muted ? "bg-wa-green" : "bg-muted-foreground/30"}`}>
            <span className={`block w-5 h-5 mt-0.5 bg-card rounded-full shadow transition-transform ${muted ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </div>
        </button>

        {/* Starred messages */}
        <button className="flex items-center gap-4 w-full px-4 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50">
          <Star className="w-5 h-5 text-muted-foreground" />
          <span className="flex-1 text-left text-[15px] text-foreground">Starred messages</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">3</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        {/* Shared groups, files */}
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Shared content</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <FileText className="w-4 h-4 text-muted-foreground" /> 5 documents
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Mic className="w-4 h-4 text-muted-foreground" /> 8 voice messages
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="py-2">
          <button className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/60 transition-colors">
            <Ban className="w-5 h-5 text-destructive" />
            <span className="text-[15px] text-destructive">Block {contact.name.split(" ")[0]}</span>
          </button>
          <button className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/60 transition-colors">
            <Trash2 className="w-5 h-5 text-destructive" />
            <span className="text-[15px] text-destructive">Delete chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
