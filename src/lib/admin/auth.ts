import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const ADMIN_SESSION_COOKIE = "chatly_admin_session";
export const ADMIN_COLLECTION = "admins";

export type AdminSession = {
  uid: string;
  email: string;
};

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    const email = decoded.email || "";
    if (!email) return null;

    const adminSnap = await adminDb.collection(ADMIN_COLLECTION).doc(decoded.uid).get();
    const adminData = adminSnap.exists ? adminSnap.data() : null;
    const claimAdmin = decoded.admin === true;
    const docAdmin = adminData?.role === "admin" && adminData?.active !== false;

    if (!claimAdmin && !docAdmin) return null;
    return { uid: decoded.uid, email };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/api/admin/logout");
  }
  return session;
}

export async function setAdminSessionCookie(idToken: string) {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}
