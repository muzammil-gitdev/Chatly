"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/chat/Sidebar";
import ChatList, { type SelectedConversation } from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import SettingsPanel from "@/components/chat/SettingsPanel";
import NewChatModal from "@/components/chat/NewChatModal";
import NewGroupModal from "@/components/chat/NewGroupModal";
import { motion } from "framer-motion";

type View = "messages" | "groups" | "settings";

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="flex h-[100dvh] bg-[#0b0c10] items-center justify-center">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold text-sm font-outfit">C</span>
        </div>
        <span className="text-zinc-500 text-sm font-medium tracking-tight">Chatly</span>
      </motion.div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ view }: { view: View }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#11131a] text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900/60 border border-zinc-800/40 flex items-center justify-center mb-4">
        <span className="text-2xl">💬</span>
      </div>
      <h2 className="text-sm font-semibold tracking-tight text-zinc-300 mb-1">
        {view === "groups" ? "Select a group" : "Select a conversation"}
      </h2>
      <p className="text-xs text-zinc-600 max-w-xs">
        {view === "groups"
          ? "Choose a group from the list or create a new one."
          : "Choose a conversation from the list or start a new one."}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const ChatPage = () => {
  const { loading } = useAuth();
  const [activeView, setActiveView] = useState<View>("messages");
  const [selected, setSelected] = useState<SelectedConversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  // ─── Listen for global chat closure signals ──────────────────────────────
  React.useEffect(() => {
    const handleClose = () => setSelected(null);
    window.addEventListener("close-chat", handleClose);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("close-chat", handleClose);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex h-[100dvh] bg-[#0b0c10] overflow-hidden text-zinc-100 antialiased font-sans">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Settings panel takes full width */}
      {activeView === "settings" ? (
        <SettingsPanel />
      ) : (
        <>
          {/* Chat / Group List */}
          <ChatList
            selected={selected}
            onSelect={setSelected}
            view={activeView}
            onNewChat={() => setShowNewChat(true)}
            onNewGroup={() => setShowNewGroup(true)}
          />

          {/* Main chat area */}
          {selected ? (
            <ChatWindow key={selected.type === "dm" ? selected.chatId : selected.groupId} conversation={selected} />
          ) : (
            <EmptyState view={activeView} />
          )}
        </>
      )}

      {/* Modals */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
      {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} />}
    </div>
  );
};

export default ChatPage;