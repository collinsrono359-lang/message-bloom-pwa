export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  phone: string;
  online: boolean;
  lastSeen: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "voice";
}

export interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
  unread: number;
  pinned: boolean;
  muted: boolean;
}

export interface StatusUpdate {
  id: string;
  contact: Contact;
  time: string;
  viewed: boolean;
  count: number;
}

export interface CallEntry {
  id: string;
  contact: Contact;
  type: "audio" | "video";
  direction: "incoming" | "outgoing" | "missed";
  time: string;
  duration?: string;
}

const avatars = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Mike",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Tom",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Chris",
];

export const contacts: Contact[] = [
  { id: "1", name: "Sarah Johnson", avatar: avatars[0], status: "Hey there! I am using ChatApp", phone: "+1 555-0101", online: true, lastSeen: "online" },
  { id: "2", name: "Mike Chen", avatar: avatars[1], status: "Busy", phone: "+1 555-0102", online: false, lastSeen: "today at 2:30 PM" },
  { id: "3", name: "Emma Wilson", avatar: avatars[2], status: "At work 💼", phone: "+1 555-0103", online: true, lastSeen: "online" },
  { id: "4", name: "Alex Rivera", avatar: avatars[3], status: "Available", phone: "+1 555-0104", online: false, lastSeen: "yesterday at 9:15 PM" },
  { id: "5", name: "Lisa Park", avatar: avatars[4], status: "Can't talk, WhatsApp only", phone: "+1 555-0105", online: false, lastSeen: "today at 11:00 AM" },
  { id: "6", name: "Tom Bradley", avatar: avatars[5], status: "🎵 Music is life", phone: "+1 555-0106", online: true, lastSeen: "online" },
  { id: "7", name: "Zoe Martinez", avatar: avatars[6], status: "On vacation ✈️", phone: "+1 555-0107", online: false, lastSeen: "2 days ago" },
  { id: "8", name: "Chris Taylor", avatar: avatars[7], status: "Working from home", phone: "+1 555-0108", online: false, lastSeen: "today at 4:45 PM" },
];

export const chats: Chat[] = [
  {
    id: "c1", contact: contacts[0], unread: 3, pinned: true, muted: false,
    messages: [
      { id: "m1", senderId: "1", text: "Hey! How are you?", timestamp: "10:30 AM", status: "read", type: "text" },
      { id: "m2", senderId: "me", text: "I'm good! Working on the project", timestamp: "10:32 AM", status: "read", type: "text" },
      { id: "m3", senderId: "1", text: "That's great! Can you share the latest designs?", timestamp: "10:33 AM", status: "read", type: "text" },
      { id: "m4", senderId: "me", text: "Sure, let me get them ready", timestamp: "10:35 AM", status: "delivered", type: "text" },
      { id: "m5", senderId: "1", text: "Thanks! Also, are we still meeting tomorrow?", timestamp: "10:36 AM", status: "delivered", type: "text" },
      { id: "m6", senderId: "1", text: "Let me know if 3pm works for you", timestamp: "10:36 AM", status: "delivered", type: "text" },
      { id: "m7", senderId: "1", text: "We could grab coffee too ☕", timestamp: "10:37 AM", status: "delivered", type: "text" },
    ],
  },
  {
    id: "c2", contact: contacts[1], unread: 0, pinned: true, muted: false,
    messages: [
      { id: "m8", senderId: "me", text: "Did you finish the report?", timestamp: "9:15 AM", status: "read", type: "text" },
      { id: "m9", senderId: "2", text: "Yes, sent it to your email", timestamp: "9:20 AM", status: "read", type: "text" },
      { id: "m10", senderId: "me", text: "Perfect, thanks Mike!", timestamp: "9:21 AM", status: "read", type: "text" },
    ],
  },
  {
    id: "c3", contact: contacts[2], unread: 1, pinned: false, muted: false,
    messages: [
      { id: "m11", senderId: "3", text: "Don't forget the meeting at 4!", timestamp: "2:00 PM", status: "read", type: "text" },
      { id: "m12", senderId: "me", text: "I'll be there 👍", timestamp: "2:05 PM", status: "read", type: "text" },
      { id: "m13", senderId: "3", text: "Great, see you then!", timestamp: "3:45 PM", status: "delivered", type: "text" },
    ],
  },
  {
    id: "c4", contact: contacts[3], unread: 0, pinned: false, muted: true,
    messages: [
      { id: "m14", senderId: "4", text: "Check out this new restaurant downtown", timestamp: "Yesterday", status: "read", type: "text" },
      { id: "m15", senderId: "me", text: "Looks amazing! Let's go this weekend", timestamp: "Yesterday", status: "read", type: "text" },
    ],
  },
  {
    id: "c5", contact: contacts[4], unread: 0, pinned: false, muted: false,
    messages: [
      { id: "m16", senderId: "5", text: "Happy birthday! 🎂🎉", timestamp: "Monday", status: "read", type: "text" },
      { id: "m17", senderId: "me", text: "Thank you Lisa! 😊", timestamp: "Monday", status: "read", type: "text" },
    ],
  },
  {
    id: "c6", contact: contacts[5], unread: 5, pinned: false, muted: false,
    messages: [
      { id: "m18", senderId: "6", text: "Have you heard the new album?", timestamp: "11:00 AM", status: "delivered", type: "text" },
    ],
  },
  {
    id: "c7", contact: contacts[6], unread: 0, pinned: false, muted: false,
    messages: [
      { id: "m19", senderId: "7", text: "The weather here is beautiful! 🌴", timestamp: "Sunday", status: "read", type: "text" },
    ],
  },
  {
    id: "c8", contact: contacts[7], unread: 2, pinned: false, muted: false,
    messages: [
      { id: "m20", senderId: "8", text: "Can you review my PR?", timestamp: "4:30 PM", status: "delivered", type: "text" },
      { id: "m21", senderId: "8", text: "It's the auth module update", timestamp: "4:31 PM", status: "delivered", type: "text" },
    ],
  },
];

export const statusUpdates: StatusUpdate[] = [
  { id: "s1", contact: contacts[0], time: "Today, 10:15 AM", viewed: false, count: 3 },
  { id: "s2", contact: contacts[2], time: "Today, 9:00 AM", viewed: false, count: 1 },
  { id: "s3", contact: contacts[5], time: "Today, 8:30 AM", viewed: true, count: 2 },
  { id: "s4", contact: contacts[6], time: "Yesterday, 6:00 PM", viewed: true, count: 5 },
  { id: "s5", contact: contacts[3], time: "Yesterday, 3:00 PM", viewed: true, count: 1 },
];

export const callHistory: CallEntry[] = [
  { id: "cl1", contact: contacts[0], type: "video", direction: "incoming", time: "Today, 10:00 AM", duration: "5:23" },
  { id: "cl2", contact: contacts[1], type: "audio", direction: "outgoing", time: "Today, 9:30 AM", duration: "12:05" },
  { id: "cl3", contact: contacts[2], type: "audio", direction: "missed", time: "Yesterday, 4:15 PM" },
  { id: "cl4", contact: contacts[5], type: "video", direction: "outgoing", time: "Yesterday, 2:00 PM", duration: "8:42" },
  { id: "cl5", contact: contacts[3], type: "audio", direction: "incoming", time: "Monday, 11:00 AM", duration: "3:15" },
  { id: "cl6", contact: contacts[4], type: "audio", direction: "missed", time: "Monday, 9:00 AM" },
  { id: "cl7", contact: contacts[7], type: "video", direction: "incoming", time: "Sunday, 7:30 PM", duration: "22:10" },
];
