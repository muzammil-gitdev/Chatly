"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Plus, UsersThree } from "@phosphor-icons/react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, type ChatDoc, type GroupDoc, type FirestoreUser } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { ChatItemSkeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export type SelectedConversation =
  | {
      type: "dm";
      chatId: string;
      other: FirestoreUser;
      participants: string[];
      status: "pending" | "active" | "rejected";
      requestedBy: string;
      unreadCount?: Record<string, number>;
      lastRead?: Record<string, any>;
      lastMessage?: string;
      lastMessageAt?: any;
    }
  | {
      type: "group";
      groupId: string;
      name: string;
      photoURL: string | null;
      adminId: string;
      members: Array<{ uid: string; status: "pending" | "accepted" }>;
      requestedBy?: string;
      unreadCount?: Record<string, number>;
      lastRead?: Record<string, any>;
      lastMessage?: string;
      lastMessageAt?: any;
      description?: string;
    };

interface ChatListProps {
  selected: SelectedConversation | null;
  onSelect: (conv: SelectedConversation) => void;
  view: "messages" | "groups";
  onNewChat: () => void;
  onNewGroup: () => void;
}

type SubTab = "all" | "pending";

// ─── Sub-tab pill ─────────────────────────────────────────────────────────────
function SubTabs({ active, onChange }: { active: SubTab; onChange: (t: SubTab) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-200/50 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-xl mb-3 border border-white/50 dark:border-white/5 shadow-inner">
      {(["all", "pending"] as SubTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative flex-1 py-1.5 text-xs rounded-lg capitalize transition-colors ${
            active === tab 
              ? "text-zinc-900 dark:text-white font-bold" 
              : "text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-700 dark:hover:text-zinc-200"
          }`}
        >
          {active === tab && (
            <motion.div
              layoutId="chatlist-subtab-pill"
              className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm dark:shadow-none rounded-lg border border-zinc-200/50 dark:border-transparent"
              transition={spring}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Real-time User Presence Hook ──────────────────────────────────────────
function usePresence(uid?: string) {
  const [profile, setProfile] = useState<FirestoreUser | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, COLLECTIONS.USERS, uid), (snap) => {
      if (snap.exists()) setProfile(snap.data() as FirestoreUser);
    });
    return unsub;
  }, [uid]);

  return profile;
}

// ─── Avatar utility ───────────────────────────────────────────────────────────
function Avatar({ 
  name, 
  photoURL, 
  online, 
  size = 10 
}: { 
  name: string; 
  photoURL?: string | null; 
  online?: boolean; 
  size?: number 
}) {
  return (
    <div className={`relative w-${size} h-${size} flex-shrink-0`}>
      <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/30 shadow-inner`}>
        {photoURL ? (
          <Image src={photoURL} alt={name} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
            {name[0]?.toUpperCase()}
          </div>
        )}
      </div>
      {online != null && (
        <span className={clsx(
          "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12141c] transition-colors duration-500", 
          online ? "bg-[#3dfc82] shadow-[0_0_8px_rgba(61,252,130,0.6)]" : "bg-zinc-600"
        )} />
      )}
    </div>
  );
}

function ChatListItem({ 
  conv, 
  isSelected, 
  onSelect,
  currentUser
}: { 
  conv: SelectedConversation; 
  isSelected: boolean; 
  onSelect: (c: SelectedConversation) => void;
  currentUser: any;
}) {
  const otherUid = conv.type === "dm" ? conv.participants.find(p => p !== currentUser?.uid) : undefined;
  const liveProfile = usePresence(otherUid);
  
  const label = conv.type === "dm" ? (liveProfile?.displayName || conv.other.displayName) : conv.name;
  const photo = conv.type === "dm" ? (liveProfile?.photoURL || conv.other.photoURL) : conv.photoURL;
  const isOnline = conv.type === "dm" ? liveProfile?.status === "online" : undefined;
  const isPending = conv.type === "dm" && conv.status === "pending";
  const unread = currentUser ? conv.unreadCount?.[currentUser.uid] : 0;

  return (
    <motion.button
      onClick={() => onSelect(conv)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className="w-full relative p-3 rounded-xl flex items-center gap-3 text-left focus:outline-none"
    >
      {/* Selection bg pill */}
      {isSelected && (
        <motion.div
          layoutId="chatlist-selection-pill"
          className="absolute inset-0 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/20 shadow-sm dark:shadow-none rounded-xl"
          transition={spring}
        />
      )}

      <div className="relative z-10 flex items-center gap-3 w-full">
        <Avatar 
          name={label} 
          photoURL={photo} 
          size={10} 
          online={isOnline}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-zinc-900 dark:text-zinc-200 truncate">{label}</span>
            {isPending ? (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 ml-2 flex-shrink-0">
                Pending
              </span>
            ) : (
              unread ? (
                <span className="w-5 h-5 flex items-center justify-center bg-[#3dfc82] text-[#0b0c10] text-[10px] font-bold rounded-full ml-2 flex-shrink-0 animate-in zoom-in duration-300">
                  {unread}
                </span>
              ) : null
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex-1 pr-2">
              {conv.type === "dm" 
                ? (isPending 
                    ? "Connection request" 
                    : conv.lastMessage || "No messages yet") 
                : (conv.lastMessage || "Group conversation")}
            </p>
            {conv.type === "dm" && !isPending && !isOnline && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                {liveProfile?.lastSeen 
                  ? formatDistanceToNow((liveProfile.lastSeen as any).toDate(), { addSuffix: true })
                  : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ChatList = ({ selected, onSelect, view, onNewChat, onNewGroup }: ChatListProps) => {
  const { user: currentUser } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [search, setSearch] = useState("");
  const [dmChats, setDmChats] = useState<SelectedConversation[]>([]);
  const [groups, setGroups] = useState<SelectedConversation[]>([]);
  const [loadingDms, setLoadingDms] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // ─── DM Chats listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub: Unsubscribe = onSnapshot(q, async (snap) => {
      const promises = snap.docs.map(async (docSnap) => {
        const chat = docSnap.data() as ChatDoc;
        const otherUid = chat.participants.find((p) => p !== currentUser.uid)!;

        // Fetch the other user's profile once (initial load)
        const userSnap = await getDoc(doc(db, COLLECTIONS.USERS, otherUid));
        if (!userSnap.exists()) return null;
        const other = userSnap.data() as FirestoreUser;

        return {
          type: "dm",
          chatId: docSnap.id,
          other,
          participants: chat.participants,
          status: chat.status,
          requestedBy: chat.requestedBy,
          unreadCount: (chat as any).unreadCount,
          lastRead: (chat as any).lastRead,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
        } as SelectedConversation;
      });

      const results = (await Promise.all(promises)).filter(Boolean) as SelectedConversation[];
      setDmChats(results);
      setLoadingDms(false);
    });

    return unsub;
  }, [currentUser]);

  // ─── Groups listener ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, COLLECTIONS.GROUPS),
      where("members", "array-contains-any", [
        { uid: currentUser.uid, status: "accepted" },
        { uid: currentUser.uid, status: "pending" },
      ])
    );

    const unsub: Unsubscribe = onSnapshot(q, (snap) => {
      const results: SelectedConversation[] = snap.docs.map((d) => {
        const g = d.data() as GroupDoc;
        return {
          type: "group",
          groupId: d.id,
          name: g.name,
          photoURL: g.photoURL,
          members: g.members,
          adminId: g.adminId,
          unreadCount: (g as any).unreadCount,
          lastRead: (g as any).lastRead,
          lastMessage: g.lastMessage,
          lastMessageAt: g.lastMessageAt,
          description: g.description,
        };
      });
      setGroups(results);
      setLoadingGroups(false);
    });

    return unsub;
  }, [currentUser]);

  // ─── Derived list ─────────────────────────────────────────────────────────
  const rawList = view === "messages" ? dmChats : groups;

  const filtered = rawList.filter((conv) => {
    const label = conv.type === "dm" ? conv.other.displayName : conv.name;
    const matchesSearch = label.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (subTab === "pending" && conv.type === "dm" && conv.status !== "pending") return false;
    return true;
  });

  return (
    <div className="w-80 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800/40 flex flex-col bg-zinc-50 dark:bg-[#12141c] h-full">
      {/* ─── Header ── */}
      <header className="h-[60px] border-b border-zinc-200 dark:border-zinc-800/40 px-5 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-[#12141c]/50 backdrop-blur-md">
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {view === "messages" ? "Messages" : "Groups"}
          </h2>
          <motion.button
            onClick={view === "messages" ? onNewChat : onNewGroup}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
            className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors"
            title={view === "messages" ? "New message" : "New group"}
          >
            {view === "messages" ? <Plus size={16} weight="bold" /> : <UsersThree size={16} weight="bold" />}
          </motion.button>
        </header>

        <div className="px-5 py-3">
        <div className="relative group">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder={view === "messages" ? "Search messages..." : "Search groups..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 focus:border-emerald-500/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-500 outline-none transition-all shadow-sm dark:shadow-none"
          />
        </div>
        <SubTabs active={subTab} onChange={setSubTab} />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {(view === "messages" ? loadingDms : loadingGroups) ? (
          <div className="space-y-1">
            <ChatItemSkeleton />
            <ChatItemSkeleton />
            <ChatItemSkeleton />
          </div>
        ) : (
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((conv) => {
                const id = conv.type === "dm" ? conv.chatId : conv.groupId;
                const isSelected =
                  selected?.type === conv.type &&
                  (selected.type === "dm" ? selected.chatId === (conv as { chatId: string }).chatId : (selected as { groupId: string }).groupId === (conv as { groupId: string }).groupId);

                return (
                  <ChatListItem 
                    key={id} 
                    conv={conv} 
                    isSelected={isSelected} 
                    onSelect={onSelect} 
                    currentUser={currentUser} 
                  />
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-48 text-center px-4"
              >
                <p className="text-sm text-zinc-600 font-medium">
                  {search ? "No results found" : view === "messages" ? "No conversations yet" : "No groups yet"}
                </p>
                <p className="text-xs text-zinc-700 mt-1">
                  {!search && (view === "messages" ? "Start a new chat" : "Create or join a group")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ChatList;
