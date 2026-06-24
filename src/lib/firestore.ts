/**
 * Firestore typed helpers — all DB access uses the centralized firebase.ts
 * singleton to avoid duplicate Firebase app initialization.
 */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Collection names (single source of truth) ───────────────────────────────
export const COLLECTIONS = {
  USERS: "users",
  CHATS: "chats",
  GROUPS: "groups",
  OTP: "otps",
} as const;

// ─── Type definitions ─────────────────────────────────────────────────────────
export interface FirestoreUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  phone: string;
  location: string;
  isActivated: boolean;
  status: "online" | "offline";
  lastSeen: any; // Firestore Timestamp
  createdAt: unknown; // Firestore Timestamp
  fcmTokens?: string[];
  settings?: { theme: "dark" | "light"; notificationsEnabled: boolean };
  blockedUsers?: string[];
  acceptedContacts?: string[];
}

export interface ChatDoc {
  participants: [string, string];
  status: "pending" | "active" | "rejected";
  requestedBy: string;
  createdAt: unknown;
  lastMessage?: string;
  lastMessageAt?: unknown;
}

export interface GroupDoc {
  name: string;
  description: string;
  photoURL: string | null;
  adminId: string;
  members: Array<{ uid: string; status: "pending" | "accepted" }>;
  createdAt: unknown;
  lastMessage?: string;
  lastMessageAt?: unknown;
}

export interface MessageDoc {
  text: string;
  senderId: string;
  timestamp: unknown;
  type: "text" | "system";
}

// ─── User helpers ─────────────────────────────────────────────────────────────
export async function getUser(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? (snap.data() as FirestoreUser) : null;
}

export async function createUser(user: Omit<FirestoreUser, "createdAt">): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  });
}

export async function updateUser(
  uid: string,
  data: Partial<Omit<FirestoreUser, "uid" | "email" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), data);
}

export async function getActivatedUsers(): Promise<FirestoreUser[]> {
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where("isActivated", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreUser);
}

// ─── Chat helpers ─────────────────────────────────────────────────────────────
/**
 * Deterministic chatId — same two UIDs always produce the same document ID.
 * Sorted lexically: sorted([uidA, uidB]).join("_")
 */
export function getDMChatId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join("_");
}

export function chatRef(chatId: string) {
  return doc(db, COLLECTIONS.CHATS, chatId);
}

export function groupRef(groupId: string) {
  return doc(db, COLLECTIONS.GROUPS, groupId);
}

export function messagesRef(
  parentCollection: "chats" | "groups",
  parentId: string
) {
  return collection(db, parentCollection, parentId, "messages");
}
