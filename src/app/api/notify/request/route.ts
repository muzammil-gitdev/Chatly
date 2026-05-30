import { NextResponse } from "next/server";
import { sendRequestEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { toEmail, fromName } = await req.json();

    if (!toEmail || !fromName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sendRequestEmail(toEmail, fromName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify request error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
