import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "email and code are required." },
        { status: 400 }
      );
    }

    // Fetch OTP document
    const otpRef = doc(db, "otps", email);
    const otpSnap = await getDoc(otpRef);

    if (!otpSnap.exists()) {
      return NextResponse.json(
        { error: "No pending verification found for this email." },
        { status: 404 }
      );
    }

    const otpData = otpSnap.data();
    const expiresAt = otpData.expiresAt as Timestamp;

    // Check expiry
    if (Timestamp.now().toMillis() > expiresAt.toMillis()) {
      await deleteDoc(otpRef);
      return NextResponse.json(
        { error: "Verification code has expired. Please register again." },
        { status: 410 }
      );
    }

    // Validate code
    if (otpData.code !== code) {
      return NextResponse.json(
        { error: "Incorrect verification code." },
        { status: 422 }
      );
    }

    // Activate — create the user profile in Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, otpData.uid), {
      uid: otpData.uid,
      displayName: otpData.displayName,
      email,
      photoURL: null,
      bio: "",
      phone: "",
      location: "",
      isActivated: true,
      createdAt: serverTimestamp(),
    });

    // Clean up the OTP document
    await deleteDoc(otpRef);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
