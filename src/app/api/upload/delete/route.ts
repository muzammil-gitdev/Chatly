import { type NextRequest, NextResponse } from "next/server";
import { deleteAvatar } from "@/lib/cloudinary";

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: "publicId is required." }, { status: 400 });
    }

    await deleteAvatar(publicId);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
