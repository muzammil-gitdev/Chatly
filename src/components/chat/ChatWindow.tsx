"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperPlaneTilt,
  Smiley,
  Paperclip,
  DotsThreeVertical,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  increment,
  writeBatch,
  getDocs,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, messagesRef, type MessageDoc, type FirestoreUser } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import type { SelectedConversation } from "./ChatList";
import MessageItem from "./MessageItem";
import SystemLog from "./SystemLog";
import { MessageSkeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

interface ChatWindowProps {
  conversation: SelectedConversation;
}

const ChatWindow = ({ conversation }: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<MessageDoc & { id: string }>>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const isDM = conversation.type === "dm";
  const parentId = isDM ? conversation.chatId : conversation.groupId;
  const parentCollection: "chats" | "groups" = isDM ? "chats" : "groups";

  // Pending logic
  const groupMember = !isDM ? conversation.members?.find((m: any) => m.uid === user?.uid) : null;
  const isPending = isDM
    ? conversation.status === "pending"
    : groupMember?.status === "pending";

  const isRequester = isDM && conversation.requestedBy === user?.uid;
  // Requesters can send messages during pending state; Recipients are locked until Accepted.
  const isLocked = isPending && !isRequester;

  const displayName = isDM ? conversation.other.displayName : conversation.name;
  const photoURL = isDM ? conversation.other.photoURL : conversation.photoURL;

  // ─── Messages listener ────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const msgRef = messagesRef(parentCollection, parentId);
    const q = query(msgRef, orderBy("timestamp", "asc"));
    const unsub: Unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as MessageDoc) })));
      setLoading(false);
    });
    return unsub;
  }, [parentCollection, parentId]);

  // ─── Typing Logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!input.trim() || !user || isLocked) {
      if (user) updateDoc(doc(db, parentCollection, parentId), { [`typing.${user.uid}`]: false });
      return;
    }

    updateDoc(doc(db, parentCollection, parentId), { [`typing.${user.uid}`]: true });
    
    const timeout = setTimeout(() => {
      updateDoc(doc(db, parentCollection, parentId), { [`typing.${user.uid}`]: false });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      updateDoc(doc(db, parentCollection, parentId), { [`typing.${user.uid}`]: false });
    };
  }, [input, user, parentId, parentCollection, isLocked]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, parentCollection, parentId), (snap) => {
      const data = snap.data();
      if (data?.typing) {
        const typingIds = Object.keys(data.typing).filter(uid => data.typing[uid] && uid !== user?.uid);
        setTypingUsers(typingIds);
      }
    });
    return unsub;
  }, [parentId, parentCollection, user?.uid]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Mark as read ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !parentId || isPending) return;

    const markAsRead = async () => {
      try {
        const parentRef = doc(db, parentCollection, parentId);
        await updateDoc(parentRef, {
          [`lastRead.${user.uid}`]: serverTimestamp(),
          [`unreadCount.${user.uid}`]: 0,
        });
      } catch (err) {
        console.error("Mark as read error:", err);
      }
    };

    markAsRead();
  }, [user, parentId, parentCollection, messages, isPending]);

  const [memberProfiles, setMemberProfiles] = useState<Record<string, string>>({});

  // ─── Resolve Member Names ──────────────────────────────────────────────────
  useEffect(() => {
    if (isDM || !("members" in conversation)) return;

    const resolveNames = async () => {
      const names: Record<string, string> = {};
      for (const m of (conversation as any).members) {
        const snap = await getDoc(doc(db, COLLECTIONS.USERS, m.uid));
        if (snap.exists()) {
          names[m.uid] = snap.data().displayName;
        }
      }
      setMemberProfiles(names);
    };

    resolveNames();
  }, [conversation, isDM]);

  // ─── Real-time User Presence Hook ──────────────────────────────────────────
  const otherUid = isDM ? (conversation as any).participants?.find((p: string) => p !== user?.uid) : null;
  const [liveProfile, setLiveProfile] = useState<FirestoreUser | null>(null);

  useEffect(() => {
    if (!otherUid) return;
    const unsub = onSnapshot(doc(db, COLLECTIONS.USERS, otherUid), (snap) => {
      if (snap.exists()) setLiveProfile(snap.data() as FirestoreUser);
    });
    return unsub;
  }, [otherUid]);

  const otherLastRead = otherUid ? (conversation.lastRead?.[otherUid] as any) : null;

  // ─── Message Status Logic ──────────────────────────────────────────────────
  const getMessageStatus = (msg: MessageDoc) => {
    if (msg.senderId !== user?.uid || !otherLastRead || !msg.timestamp) return "sent";
    const msgTime = (msg.timestamp as any).toDate ? (msg.timestamp as any).toDate() : new Date();
    const readTime = otherLastRead.toDate ? otherLastRead.toDate() : new Date();
    return msgTime <= readTime ? "read" : "sent";
  };

  // ─── Accept connection request / Group invite ────────────────────────────────
  const handleAccept = async () => {
    if (isDM) {
      await updateDoc(doc(db, COLLECTIONS.CHATS, conversation.chatId), {
        status: "active",
      });
    } else {
      // Update group member status
      const updatedMembers = conversation.members.map((m: any) =>
        m.uid === user?.uid ? { ...m, status: "accepted" } : m
      );
      await updateDoc(doc(db, COLLECTIONS.GROUPS, conversation.groupId), {
        members: updatedMembers,
      });
    }
  };

  const handleDeclineOrLeave = async () => {
    if (isDM) {
      const chatEmail = conversation.other.email;
      const myDisplayName = user?.displayName || "Someone";
      
      await deleteDoc(doc(db, COLLECTIONS.CHATS, conversation.chatId));

      // Notify User A that User B rejected
      if (isPending && !isRequester) {
        fetch("/api/notify/rejection", {
          method: "POST",
          body: JSON.stringify({ toEmail: chatEmail, fromName: myDisplayName }),
        }).catch(err => console.error("Notify rejection error:", err));
      }
    } else {
      // Remove self from group
      const updatedMembers = (conversation as any).members.filter((m: any) => m.uid !== user?.uid);
      await updateDoc(doc(db, COLLECTIONS.GROUPS, conversation.groupId), {
        members: updatedMembers,
      });
    }
  };

  const CONFIRM_DELETE = async () => {
    if (!parentId) return;
    setSending(true);
    try {
      const batch = writeBatch(db);
      
      // 1. Delete all messages
      const msgSnap = await getDocs(collection(db, parentCollection, parentId, "messages"));
      msgSnap.forEach((d) => batch.delete(d.ref));
      
      // 2. Delete chat doc
      batch.delete(doc(db, parentCollection, parentId));
      
      await batch.commit();
      (window as any).dispatchEvent(new CustomEvent("close-chat"));
    } finally {
      setSending(false);
      setShowDeleteConfirm(false);
    }
  };
  // ─── Context Menu Logic ────────────────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLocked) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const msgRef = messagesRef(parentCollection, parentId);
      await addDoc(msgRef, {
        text,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        type: "text",
      } satisfies Omit<MessageDoc, "id">);

      // Update parent doc's last message and counters
      const parentRef = doc(db, parentCollection, parentId);
      const updateData: any = {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      };

      if (isDM) {
        const otherId = conversation.participants.find((p: string) => p !== user.uid);
        if (otherId) {
          updateData[`unreadCount.${otherId}`] = increment(1);
        }
      } else {
        (conversation as any).members.forEach((m: any) => {
          if (m.uid !== user.uid) {
            updateData[`unreadCount.${m.uid}`] = increment(1);
          }
        });
      }

      await updateDoc(parentRef, updateData);

      // If it's the first message in a pending DM, notify the recipient
      if (isDM && isPending && messages.length === 0) {
        fetch("/api/notify/request", {
          method: "POST",
          body: JSON.stringify({ toEmail: conversation.other.email, fromName: user.displayName }),
        }).catch(err => console.error("Notify request error:", err));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="flex-1 flex flex-col relative bg-[#11131a] min-w-0"
    >
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="h-[60px] border-b border-zinc-800/40 bg-[#11131a]/90 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/30">
              {photoURL ? (
                <Image src={photoURL} alt={displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-semibold text-sm">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            {isDM && (liveProfile?.status === "online") && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3dfc82] rounded-full border-2 border-[#11131a] shadow-[0_0_8px_rgba(61,252,130,0.6)]" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">{displayName}</h2>
            <p className="text-[10px] font-medium tracking-wider uppercase">
              {isDM ? (
                liveProfile?.status === "online" 
                  ? <span className="text-[#3dfc82] drop-shadow-[0_0_2px_rgba(61,252,130,0.4)]">Online</span> 
                  : <span className="text-zinc-500">
                      {liveProfile?.lastSeen 
                        ? `Last seen ${formatDistanceToNow(liveProfile.lastSeen.toDate(), { addSuffix: true })}` 
                        : "Offline"}
                    </span>
              ) : (
                <span className="text-zinc-500">
                  {typingUsers.length > 0 
                    ? <span className="text-emerald-400 italic lowercase tracking-normal">some people are typing...</span>
                    : `${conversation.members?.length} members`}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isDM && (conversation as any).adminId === user?.uid && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all uppercase tracking-wider"
            >
              Add Member
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
            className="p-2 text-zinc-500 hover:text-zinc-200 rounded-xl transition-colors"
            title="Encrypted"
          >
            <ShieldCheck size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
            className="p-2 text-zinc-500 hover:text-zinc-200 rounded-xl transition-colors"
          >
            <DotsThreeVertical size={18} />
          </motion.button>
        </div>
      </header>

      {/* ─── Messages Feed ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 bg-gradient-to-b from-[#11131a] to-[#0e1015]">
        {loading ? (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton sent />
            <MessageSkeleton />
          </div>
        ) : (
          <>
            {/* Inbound connection request banner */}
        <AnimatePresence>
          {isPending && !isRequester && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={spring}
              className="mx-auto max-w-sm bg-[#14161f]/90 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl text-center mb-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={24} className="text-emerald-500" weight="fill" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">
                {isDM ? "Connection Request" : "Group Invitation"}
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                {isDM ? (
                  <>
                    <span className="text-zinc-300">{conversation.other.displayName}</span> wants to start a conversation with you.
                  </>
                ) : (
                  <>
                    You've been invited to join <span className="text-zinc-300">{conversation.name}</span>.
                  </>
                )}
              </p>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleAccept}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-emerald-500/10"
                >
                  Accept
                </motion.button>
                <motion.button
                  onClick={handleDeclineOrLeave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isDM ? "Decline" : "Leave"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System log — conversation start */}
        {messages.length === 0 && !isPending && (
          <SystemLog text="Conversation started — messages are end-to-end encrypted" />
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            text={msg.text}
            sent={msg.senderId === user?.uid}
            senderId={!isDM && msg.senderId !== user?.uid ? memberProfiles[msg.senderId] || "Member" : undefined}
            showSenderName={!isDM && msg.senderId !== user?.uid}
            time={msg.timestamp ? new Date((msg.timestamp as { toDate: () => Date }).toDate()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            type={msg.type}
            status={getMessageStatus(msg)}
          />
        ))}
        <div ref={bottomRef} />
        
        {/* Typing indicator toast-like bubble */}
        <AnimatePresence>
          {isDM && typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-24 left-6 py-1.5 px-3 bg-zinc-900/60 backdrop-blur-md border border-white/[0.04] rounded-full"
            >
              <p className="text-[10px] items-center flex gap-1.5 text-emerald-400/80 font-medium italic">
                <span className="flex gap-0.5">
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
                </span>
                {displayName} is typing
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )}
  </div>

      {/* ─── Input Bar ──────────────────────────────────────────────────── */}
      <div className="px-5 py-4 bg-[#0e1015] flex-shrink-0">
        <form
          onSubmit={handleSend}
          className={`flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl px-3 py-2 transition-all duration-300 focus-within:border-zinc-700/80 focus-within:bg-zinc-900/70 ${
            isLocked && !(!isRequester) ? "opacity-40 pointer-events-none blur-[1px]" : ""
          }`}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
            title="Emoji"
          >
            <Smiley size={20} />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </motion.button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLocked}
            placeholder={isLocked ? (isRequester ? "Waiting for acceptance..." : "Accept to reply...") : "Type a message..."}
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 disabled:cursor-not-allowed"
          />

          <motion.button
            type="submit"
            disabled={!input.trim() || isLocked || sending}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
            className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <PaperPlaneTilt size={16} weight="fill" />
          </motion.button>
        </form>
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="fixed z-[100] bg-[#1a1d28] border border-white/[0.08] rounded-xl shadow-2xl py-1.5 min-w-[160px] backdrop-blur-xl animate-in fade-in zoom-in duration-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            onClick={() => (window as any).dispatchEvent(new CustomEvent("close-chat"))}
            className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors flex items-center justify-between"
          >
            Close Chat
            <span className="text-[10px] opacity-40">Esc</span>
          </button>
          <div className="h-px bg-white/[0.04] my-1" />
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-left px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            Delete Conversation
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xs bg-[#1a1d28] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete Chat?</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                This will permanently delete all messages and remove the conversation for everyone. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={CONFIRM_DELETE}
                  disabled={sending}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all border border-red-500/20 disabled:opacity-50"
                >
                  {sending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;
