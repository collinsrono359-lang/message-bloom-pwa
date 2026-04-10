import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import ChatListScreen from "@/components/ChatListScreen";
import ChatScreen from "@/components/ChatScreen";
import StatusScreen from "@/components/StatusScreen";
import CallsScreen from "@/components/CallsScreen";
import SettingsScreen from "@/components/SettingsScreen";
import { chats, callHistory } from "@/data/mockData";
import { SettingsProvider } from "@/contexts/SettingsContext";

type Tab = "chats" | "status" | "calls" | "settings";

function AppContent() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const missedCalls = callHistory.filter(c => c.direction === "missed").length;

  if (activeChatId) {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden max-w-lg mx-auto bg-card">
        <ChatScreen chatId={activeChatId} onBack={() => setActiveChatId(null)} />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden max-w-lg mx-auto bg-card">
      <div className="flex-1 overflow-hidden pb-16">
        {tab === "chats" && <ChatListScreen onOpenChat={setActiveChatId} />}
        {tab === "status" && <StatusScreen />}
        {tab === "calls" && <CallsScreen />}
        {tab === "settings" && <SettingsScreen />}
      </div>
      <BottomNav active={tab} onTabChange={setTab} unreadChats={unreadChats} missedCalls={missedCalls} />
    </div>
  );
}

export default function Index() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
