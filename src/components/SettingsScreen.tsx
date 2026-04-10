import { Key, Bell, Lock, MessageSquare, HelpCircle, Users, Palette, Database, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PrivacySettings, NotificationSettings, ChatSettings, AccountSettings, StorageSettings, AppearanceSettings, HelpSettings, InviteSettings, PrivacyPolicy } from "@/components/SettingsSubPages";

type SubPage = null | "account" | "privacy" | "appearance" | "chats" | "notifications" | "storage" | "help" | "invite" | "privacyPolicy";

const settingsItems: { icon: typeof Key; label: string; desc: string; page: SubPage }[] = [
  { icon: Key, label: "Account", desc: "Security, two-step verification, delete account", page: "account" },
  { icon: Lock, label: "Privacy", desc: "Last seen, read receipts, disappearing messages", page: "privacy" },
  { icon: Palette, label: "Appearance", desc: "Theme, wallpaper", page: "appearance" },
  { icon: MessageSquare, label: "Chats", desc: "Font size, enter to send, media download", page: "chats" },
  { icon: Bell, label: "Notifications", desc: "Message & group tones, vibrate", page: "notifications" },
  { icon: Database, label: "Storage and Data", desc: "Storage usage, network usage", page: "storage" },
  { icon: HelpCircle, label: "Help", desc: "FAQ, support, privacy policy", page: "help" },
  { icon: Users, label: "Invite a friend", desc: "Send a chat invite link", page: "invite" },
];

export default function SettingsScreen() {
  const [subPage, setSubPage] = useState<SubPage>(null);

  if (subPage === "privacy") return <PrivacySettings onBack={() => setSubPage(null)} />;
  if (subPage === "notifications") return <NotificationSettings onBack={() => setSubPage(null)} />;
  if (subPage === "chats") return <ChatSettings onBack={() => setSubPage(null)} />;
  if (subPage === "account") return <AccountSettings onBack={() => setSubPage(null)} />;
  if (subPage === "storage") return <StorageSettings onBack={() => setSubPage(null)} />;
  if (subPage === "appearance") return <AppearanceSettings onBack={() => setSubPage(null)} />;
  if (subPage === "help") return <HelpSettings onBack={() => setSubPage(null)} onViewPrivacyPolicy={() => setSubPage("privacyPolicy")} onViewPrivacyPolicy={() => setSubPage("privacyPolicy")} />;
  if (subPage === "invite") return <InviteSettings onBack={() => setSubPage(null)} />;
  if (subPage === "privacyPolicy") return <PrivacyPolicy onBack={() => setSubPage(null)} />;

  return (
    <div className="flex flex-col h-full">
      <div className="wa-header px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {/* Profile card */}
        <button
          onClick={() => setSubPage("account")}
          className="flex items-center gap-3 w-full px-4 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl flex-shrink-0">👤</div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-lg text-foreground">You</p>
            <p className="text-sm text-muted-foreground truncate">Hey there! I am using ChatApp</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>

        <div className="py-2">
          {settingsItems.map(item => (
            <button
              key={item.label}
              onClick={() => item.page && setSubPage(item.page)}
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-secondary/60 transition-colors"
            >
              <item.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[15px] text-foreground">{item.label}</p>
                {item.desc && <p className="text-sm text-muted-foreground">{item.desc}</p>}
              </div>
              {item.page && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground">ChatApp Messenger</p>
          <p className="text-xs text-muted-foreground mt-0.5">v1.0.0 • Powered by Firebase</p>
        </div>
      </div>
    </div>
  );
}
