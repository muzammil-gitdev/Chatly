import { NextRequest, NextResponse } from "next/server";
import { uploadAvatar } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const id = (formData.get("id") || formData.get("uid")) as string;
    const type = (formData.get("type") as "profile" | "group") || "profile";

    if (!file || !id) {
      return NextResponse.json({ error: "Missing file or id" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadAvatar(buffer, id, type);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Upload API Error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
