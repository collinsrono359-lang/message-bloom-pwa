import { collection, doc, getDoc, getDocs, query, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { chats as mockChats, type Chat, type Message } from "@/data/mockData";

const chatsCollection = collection(db, "chats");

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
