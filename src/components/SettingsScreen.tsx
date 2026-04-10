import { Key, Bell, Lock, MessageSquare, HelpCircle, Users, Moon, Database, ChevronRight } from "lucide-react";

const settingsItems = [
  { icon: Key, label: "Account", desc: "Security notifications, change number" },
  { icon: Lock, label: "Privacy", desc: "Block contacts, disappearing messages" },
  { icon: Moon, label: "Appearance", desc: "Theme, wallpaper, chat display" },
  { icon: MessageSquare, label: "Chats", desc: "Theme, wallpapers, chat history" },
  { icon: Bell, label: "Notifications", desc: "Message, group & call tones" },
  { icon: Database, label: "Storage and Data", desc: "Network usage, auto-download" },
  { icon: HelpCircle, label: "Help", desc: "FAQ, contact us, privacy policy" },
  { icon: Users, label: "Invite a friend", desc: "" },
];

export default function SettingsScreen() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {/* Profile card */}
        <button className="flex items-center gap-3 w-full px-4 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-lg text-foreground">You</p>
            <p className="text-sm text-muted-foreground truncate">Hey there! I am using ChatApp</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>

        {/* Settings list */}
        <div className="py-2">
          {settingsItems.map(item => (
            <button key={item.label} className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/60 transition-colors">
              <item.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[15px] text-foreground">{item.label}</p>
                {item.desc && <p className="text-sm text-muted-foreground">{item.desc}</p>}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground">ChatApp Messenger</p>
          <p className="text-xs text-muted-foreground mt-0.5">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
