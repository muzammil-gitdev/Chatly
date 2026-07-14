import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_DASHBOARD_TAG } from "@/lib/admin/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

type Params = { params: Promise<{ uid: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  await requireAdmin();
  const { uid } = await params;
  const payload = (await request.json()) as {
    action?: "suspend" | "activate" | "update";
    displayName?: string;
    phone?: string;
    designation?: string;
    location?: string;
    bio?: string;
  };
  const { action } = payload;

  if (!uid || !action) {
    return NextResponse.json({ error: "uid and action are required." }, { status: 400 });
  }

  if (action === "update") {
    const displayName = payload.displayName?.trim();
    if (!displayName) return NextResponse.json({ error: "Display name is required." }, { status: 400 });

    await Promise.all([
      adminAuth.updateUser(uid, { displayName }),
      adminDb.collection("users").doc(uid).set(
        {
          displayName,
          phone: payload.phone?.trim() || "",
          designation: payload.designation?.trim() || "",
          location: payload.location?.trim() || "",
          bio: payload.bio?.trim() || "",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ),
    ]);

    revalidateTag(ADMIN_DASHBOARD_TAG, "max");
    return NextResponse.json({ success: true });
  }

  const isSuspended = action === "suspend";
  await Promise.all([
    adminDb.collection("users").doc(uid).set(
      {
        isSuspended,
        status: isSuspended ? "offline" : "offline",
        suspendedAt: isSuspended ? new Date().toISOString() : null,
      },
      { merge: true }
    ),
    adminAuth.updateUser(uid, { disabled: isSuspended }),
  ]);

  revalidateTag(ADMIN_DASHBOARD_TAG, "max");
  return NextResponse.json({ success: true, isSuspended });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  await requireAdmin();
  const { uid } = await params;
  if (!uid) return NextResponse.json({ error: "uid is required." }, { status: 400 });

  await Promise.allSettled([
    adminAuth.deleteUser(uid),
    adminDb.collection("users").doc(uid).delete(),
  ]);

  revalidateTag(ADMIN_DASHBOARD_TAG, "max");
  return NextResponse.json({ success: true });
}
