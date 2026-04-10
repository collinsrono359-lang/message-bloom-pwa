import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface AppSettings {
  // Privacy
  lastSeenVisible: boolean;
  profilePhotoVisible: "everyone" | "contacts" | "nobody";
  aboutVisible: "everyone" | "contacts" | "nobody";
  readReceipts: boolean;
  disappearingMessages: boolean;
  disappearingDuration: "24h" | "7d" | "90d";
  
  // Notifications
  messageNotifications: boolean;
  showPreview: boolean;
  messageTone: string;
  vibrate: boolean;
  groupNotifications: boolean;
  callRingtone: string;
  
  // Chats
  enterToSend: boolean;
  mediaAutoDownload: "wifi" | "wifi_mobile" | "never";
  fontSize: "small" | "medium" | "large";
  chatWallpaper: string;
  archiveChats: boolean;
  
  // Storage
  storageUsed: string;
  
  // Account
  twoStepVerification: boolean;
  fingerprintLock: boolean;
  
  // Display
  theme: "light" | "dark" | "system";
}

const defaultSettings: AppSettings = {
  lastSeenVisible: true,
  profilePhotoVisible: "everyone",
  aboutVisible: "everyone",
  readReceipts: true,
  disappearingMessages: false,
  disappearingDuration: "7d",
  messageNotifications: true,
  showPreview: true,
  messageTone: "Default",
  vibrate: true,
  groupNotifications: true,
  callRingtone: "Default",
  enterToSend: true,
  mediaAutoDownload: "wifi",
  fontSize: "medium",
  chatWallpaper: "default",
  archiveChats: false,
  storageUsed: "1.2 GB",
  twoStepVerification: false,
  fingerprintLock: false,
  theme: "light",
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("chatapp-settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("chatapp-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
