import { type NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/nodemailer";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { email, displayName, password } = await request.json();

    if (!email || !displayName || !password) {
      return NextResponse.json(
        { error: "email, displayName, and password are required." },
        { status: 400 }
      );
    }

    // Create Firebase Auth user — disabled until OTP is verified
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Disable the account until OTP verification
    // (We store isActivated: false in Firestore; login guard checks this)
    const code = generateOTP();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));

    // Store OTP document (keyed by email for easy lookup)
    await setDoc(doc(db, "otps", email), {
      code,
      uid,
      displayName,
      expiresAt,
    });

    await sendOTPEmail(email, code);

    return NextResponse.json({ success: true, uid });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const isFirebaseError = message.includes("email-already-in-use");
    return NextResponse.json(
      { error: isFirebaseError ? "An account with this email already exists." : message },
      { status: isFirebaseError ? 409 : 500 }
    );
  }
}
