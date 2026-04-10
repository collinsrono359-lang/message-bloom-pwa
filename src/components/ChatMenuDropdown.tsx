import { Search, VolumeX, Volume2, Image, Trash2, Ban, Star, Users } from "lucide-react";

interface ChatMenuDropdownProps {
  open: boolean;
  onClose: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onViewContact: () => void;
  onSearch: () => void;
  onClearChat: () => void;
}

export default function ChatMenuDropdown({ open, onClose, muted, onToggleMute, onViewContact, onSearch, onClearChat }: ChatMenuDropdownProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-2 top-16 z-50 bg-card rounded-xl shadow-2xl border border-border overflow-hidden min-w-[200px] animate-scale-in">
        <button onClick={() => { onViewContact(); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
          <Users className="w-4 h-4 text-muted-foreground" /> View contact
        </button>
        <button onClick={() => { onSearch(); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
          <Search className="w-4 h-4 text-muted-foreground" /> Search
        </button>
        <button onClick={() => { onToggleMute(); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
          {muted ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          {muted ? "Unmute" : "Mute"}
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
          <Image className="w-4 h-4 text-muted-foreground" /> Wallpaper
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
          <Star className="w-4 h-4 text-muted-foreground" /> Starred messages
        </button>
        <div className="border-t border-border/50" />
        <button onClick={() => { onClearChat(); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-destructive">
          <Trash2 className="w-4 h-4" /> Clear chat
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-destructive">
          <Ban className="w-4 h-4" /> Block
        </button>
      </div>
    </>
  );
}
