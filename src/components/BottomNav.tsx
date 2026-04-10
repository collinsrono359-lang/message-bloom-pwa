import { MessageCircle, CircleDot, Phone, Settings } from "lucide-react";

type Tab = "chats" | "status" | "calls" | "settings";

interface BottomNavProps {
  active: Tab;
  onTabChange: (tab: Tab) => void;
  unreadChats?: number;
  missedCalls?: number;
}

const tabs: { key: Tab; label: string; icon: typeof MessageCircle }[] = [
  { key: "chats", label: "Chats", icon: MessageCircle },
  { key: "status", label: "Status", icon: CircleDot },
  { key: "calls", label: "Calls", icon: Phone },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active, onTabChange, unreadChats = 0, missedCalls = 0 }: BottomNavProps) {
  const getBadge = (key: Tab) => {
    if (key === "chats" && unreadChats > 0) return unreadChats;
    if (key === "calls" && missedCalls > 0) return missedCalls;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          const badge = getBadge(key);
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-wa-badge text-accent-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
