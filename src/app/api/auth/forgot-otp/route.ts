import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { generateOTP, sendPasswordResetEmail } from "@/lib/nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "email is required." }, { status: 400 });
    }

    const code = generateOTP();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));

    // Reuse the otps collection — keyed by email with a "reset" type flag
    await setDoc(doc(db, "otps", `reset_${email}`), {
      code,
      email,
      expiresAt,
      type: "password_reset",
    });

    await sendPasswordResetEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
