import { type NextRequest, NextResponse } from "next/server";
import { adminMessaging, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { recipientId, title, body, data, chatId, collectionName, senderName, senderPhotoUrl } = await request.json();
    console.log("[NOTIFY] Incoming request:", { recipientId, senderName, body: body?.substring(0, 50), chatId });

    if (!recipientId || (!title && !senderName) || !body) {
      console.log("[NOTIFY] ❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userDoc = await adminDb.collection("users").doc(recipientId).get();
    if (!userDoc.exists) {
      console.log("[NOTIFY] ❌ User not found:", recipientId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Check if notifications are disabled
    if (userData?.settings?.notificationsEnabled === false) {
      console.log("[NOTIFY] ⏭️ User disabled notifications");
      return NextResponse.json({ success: true, message: "User disabled notifications" });
    }

    const tokens = userData?.fcmTokens || [];
    if (tokens.length === 0) {
      console.log("[NOTIFY] ⏭️ No FCM tokens for user:", userData?.displayName);
      return NextResponse.json({ success: true, message: "No active FCM tokens for user" });
    }

    let finalTitle = title || senderName || "New Message";
    
    // Fetch unread count if we have context
    if (chatId && collectionName && senderName) {
      const parentDoc = await adminDb.collection(collectionName).doc(chatId).get();
      if (parentDoc.exists) {
        const parentData = parentDoc.data();
        const unreadCount = parentData?.unreadCount?.[recipientId] || 0;
        
        if (unreadCount > 1) {
          finalTitle = `Chatly • ${senderName} (${unreadCount} new messages)`;
        } else {
          finalTitle = `Chatly • ${senderName}`;
        }
      }
    } else {
      finalTitle = `Chatly • ${finalTitle}`;
    }

    console.log("[NOTIFY] 📤 Sending push:", { title: finalTitle, tokens: tokens.length });

    const payload: any = {
      notification: {
        title: finalTitle,
        body,
      },
      webpush: {
        notification: {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200],
        },
        fcmOptions: {
          link: '/chat'
        }
      },
      tokens,
    };
    if (data || chatId || senderPhotoUrl || senderName) {
      payload.data = { 
        ...data, 
        chatId: chatId || "",
        senderPhotoUrl: senderPhotoUrl || "",
        senderName: senderName || ""
      };
    }

    const response = await adminMessaging.sendEachForMulticast(payload);
    console.log("[NOTIFY] ✅ Push result:", { success: response.successCount, failed: response.failureCount });
    
    // Cleanup invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success) {
          console.log("[NOTIFY] ❌ Token failed:", resp.error?.code, resp.error?.message);
          failedTokens.push(tokens[idx]);
        }
      });
      if (failedTokens.length > 0) {
        // Remove failed tokens from Firestore
        const newTokens = tokens.filter((t: string) => !failedTokens.includes(t));
        await adminDb.collection("users").doc(recipientId).update({
          fcmTokens: newTokens,
        });
        console.log("[NOTIFY] 🧹 Cleaned up", failedTokens.length, "invalid token(s)");
      }
    }

    return NextResponse.json({ success: true, responses: response });
  } catch (error: any) {
    console.error("[NOTIFY] 💥 FCM Send Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

