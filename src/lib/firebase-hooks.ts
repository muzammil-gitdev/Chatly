/**
 * Firebase real-time hooks using TanStack Query + Firestore onSnapshot.
 * Pattern: useQuery for initial data + onSnapshot to push live updates via queryClient.setQueryData
 */
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, type ChatDoc, type GroupDoc, type FirestoreUser } from "@/lib/firestore";
import type { SelectedConversation } from "@/components/chat/ChatList";

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const queryKeys = {
  chats: (uid: string) => ["chats", uid] as const,
  groups: (uid: string) => ["groups", uid] as const,
  users: () => ["users"] as const,
  chatStatus: (chatId: string) => ["chatStatus", chatId] as const,
} as const;

// ─── useChatsQuery ─────────────────────────────────────────────────────────────
/**
 * Real-time DM chats for the current user.
 * Uses onSnapshot → setQueryData so TanStack Query cache stays live.
 */
export function useChatsQuery(currentUserId: string | undefined): UseQueryResult<SelectedConversation[]> {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where("participants", "array-contains", currentUserId),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const promises = snap.docs.map(async (docSnap) => {
        const chat = docSnap.data() as ChatDoc;
        const otherUid = chat.participants.find((p) => p !== currentUserId)!;

        let other = null;
        try {
          const userSnap = await getDoc(doc(db, COLLECTIONS.USERS, otherUid));
          if (userSnap.exists()) {
            other = userSnap.data() as FirestoreUser;
          }
        } catch (error) {
          console.warn(`Could not fetch user ${otherUid}:`, error);
        }
        
        // If we can't fetch the user (e.g. they were deactivated or deleted), use a fallback
        if (!other) {
           other = {
             uid: otherUid,
             displayName: "Unknown User",
             email: "",
             photoURL: null,
             isActivated: false,
           } as FirestoreUser;
        }

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
      queryClient.setQueryData(queryKeys.chats(currentUserId), results);
    }, (error) => {
      console.warn("Error in useChatsQuery listener:", error);
    });

    return unsub;
  }, [currentUserId, queryClient]);

  return useQuery<SelectedConversation[]>({
    queryKey: queryKeys.chats(currentUserId ?? ""),
    queryFn: () => queryClient.getQueryData<SelectedConversation[]>(queryKeys.chats(currentUserId ?? "")) ?? [],
    enabled: Boolean(currentUserId),
    staleTime: Infinity, // onSnapshot keeps it fresh
  });
}

// ─── useGroupsQuery ────────────────────────────────────────────────────────────
export function useGroupsQuery(currentUserId: string | undefined): UseQueryResult<SelectedConversation[]> {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, COLLECTIONS.GROUPS),
      where("members", "array-contains-any", [
        { uid: currentUserId, status: "accepted" },
        { uid: currentUserId, status: "pending" },
      ])
    );

    const unsub = onSnapshot(q, (snap) => {
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
      queryClient.setQueryData(queryKeys.groups(currentUserId), results);
    }, (error) => {
      console.warn("Error in useGroupsQuery listener:", error);
    });

    return unsub;
  }, [currentUserId, queryClient]);

  return useQuery<SelectedConversation[]>({
    queryKey: queryKeys.groups(currentUserId ?? ""),
    queryFn: () => queryClient.getQueryData<SelectedConversation[]>(queryKeys.groups(currentUserId ?? "")) ?? [],
    enabled: Boolean(currentUserId),
    staleTime: Infinity,
  });
}

// ─── useUsersQuery ─────────────────────────────────────────────────────────────
export function useUsersQuery(currentUserId: string | undefined): UseQueryResult<FirestoreUser[]> {
  return useQuery<FirestoreUser[]>({
    queryKey: queryKeys.users(),
    queryFn: async () => {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("isActivated", "==", true)
      );
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => d.data() as FirestoreUser)
        .filter((u) => u.uid !== currentUserId);
    },
    enabled: Boolean(currentUserId),
    staleTime: 30_000, // refetch every 30s
  });
}

// ─── useChatStatusQuery ────────────────────────────────────────────────────────
/**
 * Live subscription to a single chat/group document status.
 * Used in ChatWindow to get real-time status (pending → active → rejected).
 */
export function useLiveChatDoc(
  collection_: "chats" | "groups",
  docId: string | undefined
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!docId) return;
    const key = queryKeys.chatStatus(docId);

    const unsub = onSnapshot(doc(db, collection_, docId), (snap) => {
      if (snap.exists()) {
        queryClient.setQueryData(key, snap.data());
      }
    }, (error) => {
      console.warn(`Error in useLiveChatDoc listener for ${docId}:`, error);
    });

    return unsub;
  }, [collection_, docId, queryClient]);

  return useQuery({
    queryKey: queryKeys.chatStatus(docId ?? ""),
    queryFn: () => queryClient.getQueryData(queryKeys.chatStatus(docId ?? "")) ?? null,
    enabled: Boolean(docId),
    staleTime: Infinity,
  });
}
