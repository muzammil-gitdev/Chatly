import { NextResponse } from "next/server";
import { sendRejectionEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { toEmail, fromName } = await req.json();

    if (!toEmail || !fromName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sendRejectionEmail(toEmail, fromName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify rejection error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
