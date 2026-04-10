import { useState, useRef, useCallback } from "react";
import { Check, CheckCheck, Reply, Copy, Trash2, Edit2, Star, Ban, Forward } from "lucide-react";
import { type Message } from "@/data/mockData";
import { useSettings } from "@/contexts/SettingsContext";

interface MessageBubbleProps {
  msg: Message;
  onReply: (msg: Message) => void;
  onEdit: (msg: Message) => void;
  onDelete: (msgId: string) => void;
  onUnsend: (msgId: string) => void;
  onCopy: (text: string) => void;
  onStar: (msgId: string) => void;
  onForward: (msg: Message) => void;
  replyTo?: Message | null;
  starred?: boolean;
  highlight?: string;
}

function AutoLinkedText({ text, highlight }: { text: string; highlight?: string }) {
  const combined = new RegExp(
    `(https?:\\/\\/[^\\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})|(\\+?\\d[\\d\\s\\-()]{6,}\\d)`,
    "g"
  );

  const parts: { type: "text" | "url" | "email" | "phone"; value: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...parseOTP(text.slice(lastIndex, match.index)));
    }
    if (match[1]) parts.push({ type: "url", value: match[1] });
    else if (match[2]) parts.push({ type: "email", value: match[2] });
    else if (match[3]) parts.push({ type: "phone", value: match[3] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(...parseOTP(text.slice(lastIndex)));
  if (parts.length === 0) parts.push({ type: "text", value: text });

  return (
    <>
      {parts.map((part, i) => {
        const content = part.value;
        if (part.type === "url") {
          return <a key={i} href={content} target="_blank" rel="noopener noreferrer" className="text-wa-teal underline break-all" onClick={e => e.stopPropagation()}>{content}</a>;
        }
        if (part.type === "email") {
          return <a key={i} href={`mailto:${content}`} className="text-wa-teal underline" onClick={e => e.stopPropagation()}>{content}</a>;
        }
        if (part.type === "phone") {
          return <a key={i} href={`tel:${content.replace(/[\s\-()]/g, "")}`} className="text-wa-teal underline" onClick={e => e.stopPropagation()}>{content}</a>;
        }
        // Highlight search matches in text
        if (highlight && content.toLowerCase().includes(highlight.toLowerCase())) {
          const idx = content.toLowerCase().indexOf(highlight.toLowerCase());
          return (
            <span key={i}>
              {content.slice(0, idx)}
              <mark className="bg-yellow-300/60 rounded px-0.5">{content.slice(idx, idx + highlight.length)}</mark>
              {content.slice(idx + highlight.length)}
            </span>
          );
        }
        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function parseOTP(text: string): { type: "text" | "phone"; value: string }[] {
  const otpRegex = /\b(\d{4,8})\b/g;
  const parts: { type: "text" | "phone"; value: string }[] = [];
  let lastIdx = 0;
  let m;
  while ((m = otpRegex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push({ type: "text", value: text.slice(lastIdx, m.index) });
    parts.push({ type: "phone", value: m[1] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push({ type: "text", value: text.slice(lastIdx) });
  return parts;
}

export default function MessageBubble({ msg, onReply, onEdit, onDelete, onUnsend, onCopy, onStar, onForward, replyTo, starred, highlight }: MessageBubbleProps) {
  const isMine = msg.senderId === "me";
  const { settings } = useSettings();
  const [showMenu, setShowMenu] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiping = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);

  const fontSizeClass = settings.fontSize === "small" ? "text-[13px]" : settings.fontSize === "large" ? "text-[16px]" : "text-[14.5px]";

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiping.current = false;
    longPressTimer.current = setTimeout(() => {
      if (!swiping.current) setShowMenu(true);
    }, 500);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dy > 30) { clearTimeout(longPressTimer.current); return; }
    if (Math.abs(dx) > 10) {
      swiping.current = true;
      clearTimeout(longPressTimer.current);
    }
    if (dx > 0) setSwipeX(Math.min(dx, 80));
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
    if (swipeX > 50) onReply(msg);
    setSwipeX(0);
  }, [swipeX, msg, onReply]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
  }, []);

  const TickIcon = ({ status }: { status: string }) => {
    if (!settings.readReceipts && status === "read") return <CheckCheck className="w-3.5 h-3.5 text-wa-tick" />;
    if (status === "sent") return <Check className="w-3.5 h-3.5 text-wa-tick" />;
    if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-wa-tick" />;
    return <CheckCheck className="w-3.5 h-3.5 text-wa-tick-read" />;
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} relative group`}>
      {swipeX > 10 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-60" style={{ transform: `translateX(${swipeX - 40}px) translateY(-50%)` }}>
          <Reply className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-3 py-1.5 shadow-sm relative ${isMine ? "wa-bubble-sent" : "wa-bubble-received"}`}
        style={{ transform: `translateX(${swipeX}px)`, transition: swipeX === 0 ? "transform 0.2s" : "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
      >
        {replyTo && (
          <div className="border-l-4 border-wa-teal bg-wa-teal/10 rounded px-2 py-1 mb-1 text-xs">
            <p className="font-semibold text-wa-teal">{replyTo.senderId === "me" ? "You" : "Them"}</p>
            <p className="text-muted-foreground truncate">{replyTo.text}</p>
          </div>
        )}

        <p className={`${fontSizeClass} text-foreground leading-relaxed`}>
          <AutoLinkedText text={msg.text} highlight={highlight} />
        </p>
        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
          {starred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
          <span className="text-[10.5px] text-wa-time">{msg.timestamp}</span>
          {isMine && <TickIcon status={msg.status} />}
        </div>
      </div>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div ref={menuRef} className={`absolute z-50 ${isMine ? "right-0" : "left-0"} top-full mt-1 bg-card rounded-xl shadow-2xl border border-border overflow-hidden min-w-[180px] animate-scale-in`}>
            <button onClick={() => { onReply(msg); setShowMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
              <Reply className="w-4 h-4" /> Reply
            </button>
            <button onClick={() => { onForward(msg); setShowMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
              <Forward className="w-4 h-4" /> Forward
            </button>
            <button onClick={() => { onCopy(msg.text); setShowMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button onClick={() => { onStar(msg.id); setShowMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
              <Star className={`w-4 h-4 ${starred ? "text-yellow-500 fill-yellow-500" : ""}`} /> {starred ? "Unstar" : "Star"}
            </button>
            {isMine && (
              <button onClick={() => { onEdit(msg); setShowMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-foreground">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            )}
            <button onClick={() => { onDelete(msg.id); setShowMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-destructive">
              <Trash2 className="w-4 h-4" /> Delete for me
            </button>
            {isMine && (
              <button onClick={() => { onUnsend(msg.id); setShowMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 text-sm text-destructive">
                <Ban className="w-4 h-4" /> Unsend
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
