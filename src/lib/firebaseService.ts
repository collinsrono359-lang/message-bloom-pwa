import { collection, doc, getDoc, getDocs, query, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { chats as mockChats, callHistory as mockCallHistory, type CallEntry, type Chat, type Message } from "@/data/mockData";

const chatsCollection = collection(db, "chats");
const callsCollection = collection(db, "calls");

export async function seedChatsIfEmpty(): Promise<void> {
  const snapshot = await getDocs(chatsCollection);
  if (!snapshot.empty) return;

  const seedPromises = mockChats.map((chat) =>
    setDoc(doc(chatsCollection, chat.id), {
      contact: chat.contact,
      unread: chat.unread,
      pinned: chat.pinned,
      muted: chat.muted,
      messages: chat.messages,
      updatedAt: new Date(),
    })
  );

  await Promise.all(seedPromises);
}

export async function seedCallsIfEmpty(): Promise<void> {
  const snapshot = await getDocs(callsCollection);
  if (!snapshot.empty) return;

  const seedPromises = mockCallHistory.map((call) =>
    setDoc(doc(callsCollection, call.id), {
      contact: call.contact,
      type: call.type,
      direction: call.direction,
      time: call.time,
      duration: call.duration ?? null,
      createdAt: new Date(),
    })
  );

  await Promise.all(seedPromises);
}

export async function getCallHistoryFromFirestore(): Promise<CallEntry[]> {
  const snapshot = await getDocs(query(callsCollection, orderBy("createdAt", "desc")));
  if (snapshot.empty) return [];

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data() as {
      contact: CallEntry["contact"];
      type: CallEntry["type"];
      direction: CallEntry["direction"];
      time: string;
      duration?: string | null;
    };

    return {
      id: docSnap.id,
      contact: data.contact,
      type: data.type,
      direction: data.direction,
      time: data.time,
      duration: data.duration ?? undefined,
    };
  });
}

export async function logCallToFirestore(call: CallEntry): Promise<void> {
  await setDoc(doc(callsCollection, call.id), {
    contact: call.contact,
    type: call.type,
    direction: call.direction,
    time: call.time,
    duration: call.duration ?? null,
    createdAt: new Date(),
  });
}

export async function getChatsFromFirestore(): Promise<Chat[]> {
  const snapshot = await getDocs(query(chatsCollection, orderBy("updatedAt", "desc")));
  if (snapshot.empty) return [];

  return snapshot.docs.map((chatDoc) => {
    const data = chatDoc.data() as {
      contact: Chat["contact"];
      unread?: number;
      pinned?: boolean;
      muted?: boolean;
      messages?: Message[];
    };

    return {
      id: chatDoc.id,
      contact: data.contact,
      unread: data.unread ?? 0,
      pinned: data.pinned ?? false,
      muted: data.muted ?? false,
      messages: data.messages ?? [],
    };
  });
}

export async function getChatFromFirestore(chatId: string): Promise<Chat | null> {
  const snap = await getDoc(doc(chatsCollection, chatId));
  if (!snap.exists()) return null;
  const data = snap.data() as {
    contact: Chat["contact"];
    unread?: number;
    pinned?: boolean;
    muted?: boolean;
    messages?: Message[];
  };

  return {
    id: snap.id,
    contact: data.contact,
    unread: data.unread ?? 0,
    pinned: data.pinned ?? false,
    muted: data.muted ?? false,
    messages: data.messages ?? [],
  };
}

export async function addMessageToChat(chatId: string, message: Message): Promise<void> {
  const chatRef = doc(chatsCollection, chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) throw new Error("Chat not found");

  const data = snap.data() as { messages?: Message[] };
  const existingMessages = data.messages ?? [];

  await updateDoc(chatRef, {
    messages: [...existingMessages, message],
    updatedAt: new Date(),
  });
}
