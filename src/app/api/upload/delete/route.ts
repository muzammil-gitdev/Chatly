import { type NextRequest, NextResponse } from "next/server";
import { deleteAvatars } from "@/lib/cloudinary";

export async function DELETE(request: NextRequest) {
  try {
    const { publicId, publicIds } = await request.json();
    const ids = Array.isArray(publicIds) ? publicIds : publicId ? [publicId] : [];

    if (ids.length === 0 || ids.some((id) => typeof id !== "string" || !id.trim())) {
      return NextResponse.json({ error: "publicId is required." }, { status: 400 });
    }

    await deleteAvatars([...new Set(ids.map((id) => id.trim()))]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
