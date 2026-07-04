import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "./firebase";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./firestore";

export async function requestFCMToken(userId: string) {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    // Register service worker
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const swUrl = `/firebase-messaging-sw.js?config=${encodeURIComponent(JSON.stringify(firebaseConfig))}`;
    
    // Check if we are in the browser
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register the SW
      await navigator.serviceWorker.register(swUrl);

      // ✅ Wait for the SW to be fully active before calling getToken.
      // navigator.serviceWorker.ready resolves only once an active SW controls the page,
      // preventing the "no active Service Worker" AbortError.
      const activeRegistration = await navigator.serviceWorker.ready;

      // Get token using the guaranteed-active registration
      const token = await getToken(messaging, {
        serviceWorkerRegistration: activeRegistration,
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
          fcmTokens: arrayUnion(token),
        });
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
}

let isMessageListenerRegistered = false;

export function setupForegroundMessaging() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  
  try {
    const messaging = getMessaging(app);
    if (isMessageListenerRegistered) return;
    
    import("firebase/messaging").then(({ onMessage }) => {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        
        // Suppress system notification if user is actively viewing this exact chat
        const activeChatId = sessionStorage.getItem("activeChatId");
        const incomingChatId = payload.data?.chatId;
        const isCurrentlyViewing = document.hasFocus() && activeChatId && activeChatId === incomingChatId;
        
        if (!isCurrentlyViewing) {
          const senderName = payload.data?.senderName || payload.notification?.title || "New Message";
          const body = payload.notification?.body || "You have a new message";
          const senderPhotoUrl = payload.data?.senderPhotoUrl || null;
          
          import("sonner").then(({ toast }) => {
            toast.custom((t) => (
              <div className="flex items-start gap-3 p-4 bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl w-[360px] border border-zinc-800 pointer-events-auto transition-all cursor-pointer hover:bg-zinc-800/95" onClick={() => toast.dismiss(t)}>
                <div className="relative shrink-0">
                  {senderPhotoUrl ? (
                    <img src={senderPhotoUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg shadow-sm">
                      {senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#25D366] rounded-full border-2 border-zinc-900 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#25D366"/>
                      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-[15px] truncate text-zinc-100">{senderName}</span>
                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      <span>Chatly</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <span>Now</span>
                    </div>
                  </div>
                  <p className="text-[13.5px] text-zinc-300 leading-snug line-clamp-2">{body}</p>
                </div>
              </div>
            ), {
              duration: 5000,
              id: payload.messageId || incomingChatId,
            });
          });

          if (Notification.permission === "granted" && payload.notification) {
            // Only show native OS notification if the document doesn't have focus
            if (!document.hasFocus()) {
              new Notification(`Chatly • ${senderName}`, {
                body: payload.notification.body,
                icon: "/favicon.ico",
              });
            }
          }
        }
      });
      isMessageListenerRegistered = true;
    });
  } catch (error) {
    console.error("Foreground messaging setup failed:", error);
  }
}
