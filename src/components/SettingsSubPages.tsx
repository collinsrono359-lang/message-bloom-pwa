import { ArrowLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsSubPageProps {
  onBack: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-wa-green" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

function SelectOption({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[15px] text-foreground mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${value === opt.value ? "bg-wa-teal text-wa-header-foreground" : "bg-secondary text-foreground"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PrivacySettings({ onBack }: SettingsSubPageProps) {
  const { settings, updateSetting } = useSettings();
  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Privacy</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Who can see my personal info</p>
        <SelectOption label="Last seen" value={settings.lastSeenVisible ? "everyone" : "nobody"} options={[{ label: "Everyone", value: "everyone" }, { label: "My contacts", value: "contacts" }, { label: "Nobody", value: "nobody" }]} onChange={v => updateSetting("lastSeenVisible", v === "everyone")} />
        <SelectOption label="Profile photo" value={settings.profilePhotoVisible} options={[{ label: "Everyone", value: "everyone" }, { label: "My contacts", value: "contacts" }, { label: "Nobody", value: "nobody" }]} onChange={v => updateSetting("profilePhotoVisible", v as any)} />
        <SelectOption label="About" value={settings.aboutVisible} options={[{ label: "Everyone", value: "everyone" }, { label: "My contacts", value: "contacts" }, { label: "Nobody", value: "nobody" }]} onChange={v => updateSetting("aboutVisible", v as any)} />
        <div className="border-t border-border/50 mt-2" />
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[15px] text-foreground">Read receipts</p>
            <p className="text-xs text-muted-foreground">If turned off, you won't send or receive read receipts</p>
          </div>
          <Toggle checked={settings.readReceipts} onChange={v => updateSetting("readReceipts", v)} />
        </div>
        <div className="border-t border-border/50" />
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[15px] text-foreground">Disappearing messages</p>
            <p className="text-xs text-muted-foreground">{settings.disappearingMessages ? `Messages disappear after ${settings.disappearingDuration}` : "Off"}</p>
          </div>
          <Toggle checked={settings.disappearingMessages} onChange={v => updateSetting("disappearingMessages", v)} />
        </div>
        {settings.disappearingMessages && (
          <SelectOption label="Default timer" value={settings.disappearingDuration} options={[{ label: "24 hours", value: "24h" }, { label: "7 days", value: "7d" }, { label: "90 days", value: "90d" }]} onChange={v => updateSetting("disappearingDuration", v as any)} />
        )}
      </div>
    </div>
  );
}

export function NotificationSettings({ onBack }: SettingsSubPageProps) {
  const { settings, updateSetting } = useSettings();
  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Message notifications</p>
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-[15px] text-foreground">Notification tones</p>
          <Toggle checked={settings.messageNotifications} onChange={v => updateSetting("messageNotifications", v)} />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-[15px] text-foreground">Vibrate</p>
          <Toggle checked={settings.vibrate} onChange={v => updateSetting("vibrate", v)} />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-[15px] text-foreground">Show preview</p>
          <Toggle checked={settings.showPreview} onChange={v => updateSetting("showPreview", v)} />
        </div>
        <div className="border-t border-border/50 mt-2" />
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Group notifications</p>
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-[15px] text-foreground">Group tones</p>
          <Toggle checked={settings.groupNotifications} onChange={v => updateSetting("groupNotifications", v)} />
        </div>
      </div>
    </div>
  );
}

export function ChatSettings({ onBack }: SettingsSubPageProps) {
  const { settings, updateSetting } = useSettings();
  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Chats</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Display</p>
        <SelectOption label="Font size" value={settings.fontSize} options={[{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }]} onChange={v => updateSetting("fontSize", v as any)} />
        <SelectOption label="Theme" value={settings.theme} options={[{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }, { label: "System", value: "system" }]} onChange={v => updateSetting("theme", v as any)} />
        <div className="border-t border-border/50 mt-2" />
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Chat settings</p>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-[15px] text-foreground">Enter is Send</p>
            <p className="text-xs text-muted-foreground">Enter key will send your message</p>
          </div>
          <Toggle checked={settings.enterToSend} onChange={v => updateSetting("enterToSend", v)} />
        </div>
        <SelectOption label="Media auto-download" value={settings.mediaAutoDownload} options={[{ label: "Wi-Fi only", value: "wifi" }, { label: "Wi-Fi & Mobile", value: "wifi_mobile" }, { label: "Never", value: "never" }]} onChange={v => updateSetting("mediaAutoDownload", v as any)} />
        <div className="border-t border-border/50 mt-2" />
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-[15px] text-foreground">Archive chats</p>
            <p className="text-xs text-muted-foreground">Keep archived chats archived</p>
          </div>
          <Toggle checked={settings.archiveChats} onChange={v => updateSetting("archiveChats", v)} />
        </div>
      </div>
    </div>
  );
}

export function AccountSettings({ onBack }: SettingsSubPageProps) {
  const { settings, updateSetting } = useSettings();
  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Account</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Security</p>
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[15px] text-foreground">Two-step verification</p>
            <p className="text-xs text-muted-foreground">Add a PIN for extra security</p>
          </div>
          <Toggle checked={settings.twoStepVerification} onChange={v => updateSetting("twoStepVerification", v)} />
        </div>
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[15px] text-foreground">Fingerprint lock</p>
            <p className="text-xs text-muted-foreground">Require fingerprint to open ChatApp</p>
          </div>
          <Toggle checked={settings.fingerprintLock} onChange={v => updateSetting("fingerprintLock", v)} />
        </div>
        <div className="border-t border-border/50 mt-2" />
        <button className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors">
          <p className="text-[15px] text-foreground">Change number</p>
          <p className="text-xs text-muted-foreground">Change your phone number</p>
        </button>
        <button className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors">
          <p className="text-[15px] text-foreground">Request account info</p>
          <p className="text-xs text-muted-foreground">Export your account information</p>
        </button>
        <div className="border-t border-border/50 mt-2" />
        <button className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors">
          <p className="text-[15px] text-destructive font-medium">Delete my account</p>
        </button>
      </div>
    </div>
  );
}

export function StorageSettings({ onBack }: SettingsSubPageProps) {
  const { settings } = useSettings();
  const storageItems = [
    { label: "Sarah Johnson", size: "245 MB", color: "bg-wa-green" },
    { label: "Mike Chen", size: "180 MB", color: "bg-wa-teal" },
    { label: "Emma Wilson", size: "120 MB", color: "bg-accent" },
    { label: "Group: Design Team", size: "98 MB", color: "bg-primary" },
    { label: "Tom Bradley", size: "67 MB", color: "bg-muted-foreground" },
  ];

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Storage and Data</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {/* Storage bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Storage used</p>
            <p className="text-sm font-semibold text-wa-teal">{settings.storageUsed}</p>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-wa-green" style={{ width: "35%" }} />
            <div className="h-full bg-wa-teal" style={{ width: "25%" }} />
            <div className="h-full bg-primary" style={{ width: "15%" }} />
            <div className="h-full bg-muted-foreground/40" style={{ width: "10%" }} />
          </div>
        </div>
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Chats</p>
        {storageItems.map(item => (
          <button key={item.label} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
            <div className={`w-10 h-10 rounded-full ${item.color} opacity-80`} />
            <div className="flex-1 text-left">
              <p className="text-[15px] text-foreground">{item.label}</p>
            </div>
            <p className="text-sm text-muted-foreground">{item.size}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
        <div className="border-t border-border/50 mt-2" />
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Network usage</p>
        <div className="px-4 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sent</span><span className="text-foreground font-medium">420 MB</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Received</span><span className="text-foreground font-medium">780 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppearanceSettings({ onBack }: SettingsSubPageProps) {
  const { settings, updateSetting } = useSettings();
  const wallpapers = [
    { id: "default", color: "bg-wa-chat-bg", label: "Default" },
    { id: "ocean", color: "bg-blue-200", label: "Ocean" },
    { id: "forest", color: "bg-green-200", label: "Forest" },
    { id: "sunset", color: "bg-orange-200", label: "Sunset" },
    { id: "midnight", color: "bg-slate-800", label: "Midnight" },
    { id: "lavender", color: "bg-purple-200", label: "Lavender" },
  ];

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Appearance</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-wa-teal uppercase tracking-wider">Theme</p>
        <SelectOption label="" value={settings.theme} options={[{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }, { label: "System default", value: "system" }]} onChange={v => updateSetting("theme", v as any)} />
        <div className="border-t border-border/50 mt-2" />
        <p className="px-4 pt-4 pb-2 text-xs font-semibold text-wa-teal uppercase tracking-wider">Chat wallpaper</p>
        <div className="px-4 pb-4 grid grid-cols-3 gap-3">
          {wallpapers.map(w => (
            <button
              key={w.id}
              onClick={() => updateSetting("chatWallpaper", w.id)}
              className={`aspect-[3/4] rounded-xl ${w.color} border-2 transition-all flex items-end justify-center pb-2 ${settings.chatWallpaper === w.id ? "border-wa-teal shadow-md scale-105" : "border-transparent"}`}
            >
              <span className="text-xs font-medium text-foreground/70">{w.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
