"use client";

import React, { useState } from "react";
import { 
    MoreVertical, 
    Send,
    Smile,
    Paperclip,
    Shield
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Modular Components
import Sidebar from "@/components/chat/Sidebar";
import ChatList from "@/components/chat/ChatList";
import MessageItem from "@/components/chat/MessageItem";
import InboundRequest from "@/components/chat/InboundRequest";
import SystemLog from "@/components/chat/SystemLog";

// Mock Data
const contacts = [
    { id: 1, name: "Alex Rivera", lastMsg: "The server is ready.", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: "Project Aurora", lastMsg: "System Log: Member 'Sarah' joined.", time: "Yesterday", unread: 0, online: false, isGroup: true },
    { id: 3, name: "Sarah Chen", lastMsg: "Did you update the handshake protocol?", time: "2 days ago", unread: 0, online: true },
];

const initialMessages = [
    { id: 1, text: "Hey! How's the progress on the serverless backend?", sent: true, status: "read", time: "10:25 AM" },
    { id: 2, text: "Coming along great. High-performance reactive state management is solid.", sent: false, time: "10:26 AM" },
    { id: 3, text: "The dual-layer permission system is live too.", sent: false, time: "10:26 AM" },
    { id: 4, text: "The server is ready.", sent: false, time: "10:30 AM" },
];

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(contacts[0]);
    const [showHandshake, setShowHandshake] = useState(true);

    return (
        <div className="flex h-screen bg-background overflow-hidden font-inter">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Contacts List */}
            <ChatList 
                contacts={contacts} 
                selectedChatId={selectedChat.id} 
                onSelectChat={setSelectedChat} 
            />

            {/* Chat Workspace */}
            <div className="flex-1 flex flex-col relative bg-background">
                {/* Header */}
                <header className="h-20 border-b border-border flex items-center justify-between px-8 glass absolute top-0 w-full z-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold font-outfit text-foreground">
                            {selectedChat.name[0]}
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight">{selectedChat.name}</h2>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                                {selectedChat.online ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Security Info">
                            <Shield className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="More Options">
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 pt-32 space-y-6">
                    <AnimatePresence>
                        {showHandshake && (
                            <InboundRequest 
                                onAccept={() => setShowHandshake(false)} 
                                onDecline={() => console.log("Declined")} 
                            />
                        )}
                    </AnimatePresence>

                    {initialMessages.map((msg) => (
                        <MessageItem 
                            key={msg.id}
                            text={msg.text}
                            sent={msg.sent}
                            time={msg.time}
                            status={msg.status}
                        />
                    ))}

                    <SystemLog text="User joined Project Aurora" />
                    <SystemLog text="Encryption handshake initiated" />
                </div>

                {/* Input Area */}
                <div className="p-6 pt-0">
                    <div className={`glass rounded-2xl p-2 flex items-center space-x-2 border-border transition-all ${
                        showHandshake ? "opacity-50 pointer-events-none grayscale" : "shadow-lg shadow-black/5"
                    }`}>
                        <button className="p-3 text-muted-foreground hover:text-primary transition-colors" title="Emoji">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-muted-foreground hover:text-primary transition-colors" title="Attach">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            placeholder={showHandshake ? "Connection required..." : "Type your message..."}
                            className="flex-1 bg-transparent border-none outline-none text-sm px-2 font-medium"
                        />
                        <button className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
