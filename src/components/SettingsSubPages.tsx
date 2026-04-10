import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

interface SettingsSubPageProps {
  onBack: () => void;
  onViewPrivacyPolicy?: () => void;
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

  const handleChangeNumber = () => {
    toast.info("To change your number, verify the new number in a real app.");
  };

  const handleRequestInfo = () => {
    toast.success("Account info request submitted. You will be notified when ready.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Delete your account permanently? This cannot be undone.")) {
      toast.success("Your account has been deleted (demo mode).");
    }
  };

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
        <button
          onClick={handleChangeNumber}
          className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors"
        >
          <p className="text-[15px] text-foreground">Change number</p>
          <p className="text-xs text-muted-foreground">Update your phone number</p>
        </button>
        <button
          onClick={handleRequestInfo}
          className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors"
        >
          <p className="text-[15px] text-foreground">Request account info</p>
          <p className="text-xs text-muted-foreground">Export your account information</p>
        </button>
        <div className="border-t border-border/50 mt-2" />
        <button
          onClick={handleDeleteAccount}
          className="w-full px-4 py-4 text-left hover:bg-secondary/60 transition-colors"
        >
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
          <button
            key={item.label}
            onClick={() => toast.info(`${item.label} uses ${item.size} of storage.`)}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors"
          >
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

export function HelpSettings({ onBack, onViewPrivacyPolicy }: SettingsSubPageProps) {
  const faqs = [
    {
      question: "How do I update my privacy settings?",
      answer: "Open Privacy in Settings to manage last seen, read receipts, profile visibility, and disappearing messages.",
    },
    {
      question: "How can I invite a friend?",
      answer: "Use Invite a friend to send an email invitation or copy a shareable message quickly.",
    },
    {
      question: "Can I use status updates with photos or videos?",
      answer: "Yes — add a new status from the Status tab. Images are resized to 10MP and videos are limited to 10MB.",
    },
    {
      question: "Where can I read the privacy policy?",
      answer: "Tap Privacy policy below to read the full version inside the app.",
    },
  ];

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Help</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <div className="p-4 space-y-4">
          <div className="rounded-3xl bg-secondary p-4 border border-border/50 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">FAQ</h2>
            {faqs.map(faq => (
              <div key={faq.question} className="rounded-2xl bg-background border border-border p-3">
                <p className="text-[15px] font-medium text-foreground">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.open("mailto:support@chatapp.example.com")}
            className="w-full rounded-2xl bg-wa-green px-4 py-3 text-sm font-medium text-white hover:bg-wa-green/90 transition-colors"
          >
            Contact support
          </button>
          <button
            onClick={onViewPrivacyPolicy}
            className="w-full rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
          >
            Privacy policy
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy({ onBack }: SettingsSubPageProps) {
  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide px-4 pb-6">
        <div className="rounded-3xl bg-secondary p-5 border border-border/50 space-y-4">
          <p className="text-sm text-muted-foreground">This privacy policy explains how ChatApp collects and handles your information while using the app.</p>
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Data collection</h2>
              <p className="text-sm text-muted-foreground">We only collect the information you provide, such as your profile details and chat messages. Your data is stored securely in Firebase and is never shared without permission.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Message privacy</h2>
              <p className="text-sm text-muted-foreground">Messages and status uploads are kept private within the app. You control who can see your profile, last seen, and status updates.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Status uploads</h2>
              <p className="text-sm text-muted-foreground">Photo uploads are optimized for performance and resized to a maximum of 10 megapixels. Video uploads are limited to 10 MB to keep status updates fast.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Contact</h2>
              <p className="text-sm text-muted-foreground">If you have questions about privacy, email support@chatapp.example.com.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InviteSettings({ onBack }: SettingsSubPageProps) {
  const inviteText = "Join me on ChatApp! Download the app and chat securely.";
  const [email, setEmail] = useState("");

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      toast.success("Invite text copied to clipboard");
    } catch {
      toast.error("Unable to copy invite text");
    }
  };

  const handleSendInvite = () => {
    const normalizedEmail = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!validEmail) {
      toast.error("Enter a valid email address to send an invite.");
      return;
    }

    toast.success(`Invitation sent to ${normalizedEmail}`);
    setEmail("");
  };

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="wa-header px-2 pt-10 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-primary/20"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold">Invite a friend</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <div className="p-4 space-y-4">
          <div className="rounded-3xl bg-secondary p-4 border border-border/50 space-y-3">
            <p className="text-sm text-muted-foreground">Send an invite by email or copy the invite text to share it in any app.</p>
            <div>
              <label className="text-sm font-medium text-foreground">Friend&apos;s email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-wa-teal"
              />
            </div>
            <button
              onClick={handleSendInvite}
              className="w-full rounded-2xl bg-wa-teal px-4 py-3 text-sm font-medium text-white hover:bg-wa-teal/90 transition-colors"
            >
              Send invitation
            </button>
          </div>
          <div className="rounded-3xl bg-secondary p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">Invite text</p>
            <div className="mt-3 rounded-2xl bg-background border border-border p-3 text-sm text-foreground">
              {inviteText}
            </div>
          </div>
          <button
            onClick={copyInvite}
            className="w-full rounded-2xl bg-wa-teal px-4 py-3 text-sm font-medium text-white hover:bg-wa-teal/90 transition-colors"
          >
            Copy invite
          </button>
        </div>
      </div>
    </div>
  );
}
