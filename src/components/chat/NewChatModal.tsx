"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { collection, getDocs, query, where, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, getDMChatId, type FirestoreUser } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

interface NewChatModalProps {
  onClose: () => void;
}

const NewChatModal = ({ onClose }: NewChatModalProps) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  // Load all activated users (excluding self)
  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("isActivated", "==", true)
      );
      const snap = await getDocs(q);
      setUsers(
        snap.docs
          .map((d) => d.data() as FirestoreUser)
          .filter((u) => u.uid !== user.uid)
      );
      setLoading(false);
    };
    fetchUsers();
  }, [user]);

  const filtered = users.filter((u) =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartChat = async (target: FirestoreUser) => {
    if (!user || creating) return;
    setCreating(target.uid);
    try {
      const chatId = getDMChatId(user.uid, target.uid);
      await setDoc(
        doc(db, COLLECTIONS.CHATS, chatId),
        {
          participants: [user.uid, target.uid].sort(),
          status: "pending",
          requestedBy: user.uid,
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
          lastMessage: "",
        },
        { merge: true } // prevent overwriting existing chats
      );
      onClose();
    } finally {
      setCreating(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={spring}
          className="w-full max-w-md bg-[#12141c] border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/40">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">New Message</h2>
            <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-4">
            <div className="relative mb-3">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 focus:border-zinc-700/80 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 outline-none transition-all"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-0.5">
              {loading ? (
                <p className="text-center text-sm text-zinc-600 py-8">Loading users...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-sm text-zinc-600 py-8">No users found</p>
              ) : (
                filtered.map((u) => (
                  <motion.button
                    key={u.uid}
                    onClick={() => handleStartChat(u)}
                    disabled={creating === u.uid}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors text-left disabled:opacity-60"
                  >
                    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-zinc-800 border border-zinc-700/30">
                      {u.photoURL ? (
                        <Image src={u.photoURL} alt={u.displayName} width={36} height={36} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
                          {u.displayName[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{u.displayName}</p>
                      <p className="text-xs text-zinc-600 truncate">{u.email}</p>
                    </div>
                    {creating === u.uid && (
                      <span className="ml-auto text-xs text-emerald-400">Connecting...</span>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewChatModal;
