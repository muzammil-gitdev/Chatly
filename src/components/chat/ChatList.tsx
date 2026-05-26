"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

interface Contact {
    id: number;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
    online: boolean;
    isGroup?: boolean;
}

interface ChatListProps {
    contacts: Contact[];
    selectedChatId: number;
    onSelectChat: (contact: any) => void;
    view: "messages" | "groups";
}

const ChatList = ({ contacts, selectedChatId, onSelectChat, view }: ChatListProps) => {
    const [subTab, setSubTab] = useState<"all" | "unread" | "archived">("all");

    // Filter contacts based on view (messages vs groups)
    const filteredContacts = contacts.filter(c => 
        view === "groups" ? c.isGroup : !c.isGroup
    );

    return (
        <div className="w-full md:w-96 flex-shrink-0 border-r border-border flex flex-col bg-background/50 h-full transition-all">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black">
                        {view === "messages" ? "Messages" : "Groups"}
                    </h1>
                    <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="relative group mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder={view === "messages" ? "Search chats..." : "Search groups..."}
                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/30 outline-none transition-all"
                    />
                </div>

                {/* Sub Tabs */}
                <div className="flex space-x-1 p-1 bg-secondary/30 rounded-xl mb-4">
                    <button 
                        onClick={() => setSubTab("all")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subTab === "all" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setSubTab("unread")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subTab === "unread" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Unread
                    </button>
                    <button 
                        onClick={() => setSubTab("archived")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subTab === "archived" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Archived
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
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
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-50">
                        <p className="text-sm font-medium">No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
