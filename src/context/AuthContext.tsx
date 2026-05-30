"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { COLLECTIONS, type FirestoreUser } from "@/lib/firestore";
import Cookies from "js-cookie";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  profile: FirestoreUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Persist session token for middleware route guard
        const token = await firebaseUser.getIdToken();
        Cookies.set("chatly_session", token, { expires: 7, sameSite: "lax" });
      } else {
        Cookies.remove("chatly_session");
        setProfile(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  // Sync Firestore profile in real-time whenever user changes
  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, COLLECTIONS.USERS, user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
      setProfile(snap.exists() ? (snap.data() as FirestoreUser) : null);
      setLoading(false);
    });

    return unsubscribeProfile;
  }, [user]);

  // ─── Presence Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, COLLECTIONS.USERS, user.uid);

    const updateStatus = async (status: "online" | "offline") => {
      try {
        await updateDoc(userRef, {
          status,
          lastSeen: serverTimestamp(),
        });
      } catch (error) {
        // Ignore errors during logout/cleanup
        console.warn("Presence update ignored during cleanup/error:", error);
      }
    };

    // Go online
    updateStatus("online");

    const handleFocus = () => updateStatus("online");
    const handleBlur = () => updateStatus("offline");
    const handleVisibilityChange = () => {
      updateStatus(document.visibilityState === "visible" ? "online" : "offline");
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // We don't await here to avoid blocking unmount
      updateStatus("offline");
    };
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    Cookies.set("chatly_session", token, { expires: 7, sameSite: "lax" });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    Cookies.remove("chatly_session");
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
