import { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import BottomNav from "@/components/BottomNav";
import ChatListScreen from "@/components/ChatListScreen";
import ChatScreen from "@/components/ChatScreen";
import StatusScreen from "@/components/StatusScreen";
import CallsScreen from "@/components/CallsScreen";
import SettingsScreen from "@/components/SettingsScreen";
import { chats as mockChats, callHistory as mockCallHistory } from "@/data/mockData";
import { seedChatsIfEmpty, getChatsFromFirestore, seedCallsIfEmpty, getCallHistoryFromFirestore } from "@/lib/firebaseService";
import { auth } from "@/lib/firebase";
import { SettingsProvider } from "@/contexts/SettingsContext";

type Tab = "chats" | "status" | "calls" | "settings";

function AppContent() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<typeof mockChats>(mockChats);
  const [callEntries, setCallEntries] = useState<typeof mockCallHistory>(mockCallHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.warn("Anonymous Firebase auth failed:", error);
      }

      try {
        await seedChatsIfEmpty();
        await seedCallsIfEmpty();

        const firestoreChats = await getChatsFromFirestore();
        if (firestoreChats.length > 0) {
          setChats(firestoreChats);
        }

        const firestoreCalls = await getCallHistoryFromFirestore();
        if (firestoreCalls.length > 0) {
          setCallEntries(firestoreCalls);
        }
      } catch (error) {
        console.error("Failed to initialize Firebase data:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const missedCalls = callEntries.filter(c => c.direction === "missed").length;

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center text-sm text-muted-foreground">
        Loading chats...
      </div>
    );
  }

  const handleUpdateChat = (updatedChat: typeof mockChats[number]) => {
    setChats(prev => prev.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
  };

  if (activeChatId) {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden max-w-lg mx-auto bg-card">
        <ChatScreen chatId={activeChatId} onBack={() => setActiveChatId(null)} onUpdateChat={handleUpdateChat} />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden max-w-lg mx-auto bg-card">
      <div className="flex-1 overflow-hidden pb-16">
        {tab === "chats" && <ChatListScreen chats={chats} onOpenChat={setActiveChatId} />}
        {tab === "status" && <StatusScreen />}
        {tab === "calls" && <CallsScreen callHistory={callEntries} onLogCall={(call) => setCallEntries(prev => [call, ...prev])} />}
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
