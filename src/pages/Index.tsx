import { useCallback, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";
import BottomNav from "@/components/BottomNav";
import ChatListScreen from "@/components/ChatListScreen";
import ChatScreen from "@/components/ChatScreen";
import StatusScreen from "@/components/StatusScreen";
import CallsScreen from "@/components/CallsScreen";
import SettingsScreen from "@/components/SettingsScreen";
import SignUpModal from "@/components/SignUpModal";
import { chats as mockChats, callHistory as mockCallHistory } from "@/data/mockData";
import {
  seedChatsIfEmpty,
  getChatsFromFirestore,
  seedCallsIfEmpty,
  getCallHistoryFromFirestore,
} from "@/lib/firebaseService";
import { auth } from "@/lib/firebase";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { toast } from "sonner";

type Tab = "chats" | "status" | "calls" | "settings";

function AppContent() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<typeof mockChats>(mockChats);
  const [callEntries, setCallEntries] = useState<typeof mockCallHistory>(mockCallHistory);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const initializeApp = useCallback(async () => {
    try {
      setLoading(true);
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
      toast.error("Unable to load app data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setAuthUser(user);
      setAuthReady(true);
      if (user) {
        await initializeApp();
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [initializeApp]);

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setAuthError("Unable to sign in with Google. Please try another method.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithApple = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const provider = new OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Apple sign-in failed:", error);
      setAuthError("Unable to sign in with Apple. Please try another method.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email sign-up failed:", error);
      setAuthError("Unable to create an account with that email.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email sign-in failed:", error);
      setAuthError("Unable to sign in with that email and password.");
    } finally {
      setAuthLoading(false);
    }
  };

  const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const missedCalls = callEntries.filter(c => c.direction === "missed").length;

  if (!authReady) {
    return (
      <div className="h-[100dvh] flex items-center justify-center text-sm text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="h-[100dvh] bg-background">
        <SignUpModal
          open={!authUser}
          onGoogle={signInWithGoogle}
          onApple={signInWithApple}
          onEmailSignUp={signUpWithEmail}
          onEmailSignIn={signInWithEmail}
          error={authError}
          loading={authLoading}
        />
      </div>
    );
  }

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
        {tab === "calls" && <CallsScreen callHistory={callEntries} onLogCall={call => setCallEntries(prev => [call, ...prev])} />}
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
