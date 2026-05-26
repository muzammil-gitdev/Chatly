"use client";

import React from "react";
import { Search } from "lucide-react";

interface Contact {
    id: number;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
    online: boolean;
}

interface ChatListProps {
    contacts: Contact[];
    selectedChatId: number;
    onSelectChat: (contact: any) => void;
}

const ChatList = ({ contacts, selectedChatId, onSelectChat }: ChatListProps) => {
    return (
        <div className="w-96 border-r border-border flex flex-col bg-background/50 h-full">
            <div className="p-6">
                <h1 className="text-2xl font-black mb-6">Messages</h1>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search chats..."
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/30 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2">
                {contacts.map((contact) => (
                    <button 
                        key={contact.id}
                        onClick={() => onSelectChat(contact)}
                        className={`w-full p-4 rounded-2xl flex items-center space-x-4 transition-all duration-200 ${
                            selectedChatId === contact.id ? "bg-primary/10 shadow-sm" : "hover:bg-secondary/50"
                        }`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                                {contact.name[0]}
                            </div>
                            {contact.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-sm truncate">{contact.name}</h3>
                                <span className="text-[10px] text-muted-foreground">{contact.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{contact.lastMsg}</p>
                        </div>
                        {contact.unread > 0 && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                {contact.unread}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
