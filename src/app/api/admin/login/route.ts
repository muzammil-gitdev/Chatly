import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { ADMIN_COLLECTION, setAdminSessionCookie } from "@/lib/admin/auth";

type FirebasePasswordResponse = {
  idToken?: string;
  localId?: string;
  email?: string;
  error?: { message?: string };
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Firebase API key is missing." }, { status: 500 });
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
        cache: "no-store",
      }
    );
    const payload = (await response.json()) as FirebasePasswordResponse;

    if (!response.ok || !payload.idToken || !payload.localId) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(payload.idToken, true);
    const adminSnap = await adminDb.collection(ADMIN_COLLECTION).doc(decoded.uid).get();
    const adminData = adminSnap.exists ? adminSnap.data() : null;
    const isAdmin = decoded.admin === true || (adminData?.role === "admin" && adminData?.active !== false);

    if (!isAdmin) {
      return NextResponse.json({ error: "This account is not an admin." }, { status: 403 });
    }

    await setAdminSessionCookie(payload.idToken);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
