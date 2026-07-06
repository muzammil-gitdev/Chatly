# 💬 Chatly — Serverless Real-Time Messaging Platform

**Chatly** is a high-performance, serverless real-time messaging application designed with a robust dual-layer permission system, hierarchical group structures, and reactive state management. Built explicitly using **Next.js (App Router)** and **TypeScript** as a **Full-Stack Application**, the architecture leverages native edge environments and client-directed synchronization loops to provide an ultra-responsive, WhatsApp-like desktop and mobile ecosystem.

---

## ✨ Core Features

### 🗣️ Individual & Group Chatting
*   **One-on-One Messaging:** Enjoy seamless, real-time individual chats with read receipts and active typing indicators.
*   **Hierarchical Group Streams:** Create and manage groups with granular authorization. Out-of-the-box structural authority maps out Group Creators/Admins from generalized members. Admins retain strict functional privileges to add, prune, or re-route user identities.
*   **Sovereign Exits & System Logs:** Members can independently leave groups at any time. Native mutations (e.g., additions, deliberate exits) are compiled as isolated systemic events and rendered as unique mid-stream timeline logs.
*   **Local Conversation Clearing:** Users can clear a conversation only for themselves. The other participant or group members keep their own chat history intact.
*   **Selective Message Deletion:** Users can select messages and delete them for themselves, or delete their own sent messages for everyone. Chatly removes deleted-for-everyone messages completely instead of leaving a placeholder.
*   **Message Forwarding:** Selected messages can be forwarded into direct chats or groups, with forwarded messages clearly labeled in the conversation.
*   **Short-Window Message Editing:** Sent messages can be edited by the sender within a strict 3-minute window, with edited messages marked in the UI.

### 🔔 Push Notifications via Firebase FCM
*   **Real-Time Alerts:** Stay connected with instant push notifications powered by Firebase Cloud Messaging (FCM).
*   **Background Sync:** Receive reliable updates for new messages, group invites, and system events even when the app is minimized or running in the background.

### 🎨 Chat UI Customization & Theming
*   **Dynamic Theme Synchronization:** Zero-flicker Automated Theme Switcher Engine configured directly via hardware tokens and user preference.
*   **Solar Light Profile:** Formulated for high-glare environments using strict slate tones (`#f8fafc`) and crisp, clean typography.
*   **Deep Tech Dark Profile:** Mapped out on custom gray-to-black gradient palettes (`#0B0F19`) utilizing high-contrast accents to ensure minimal ocular fatigue.
*   **Personalized Workspaces:** Tailor your chat interface to your liking for a truly custom messaging experience.

### 👤 Profile & Contact Management
*   **Profile Picture Setting:** Upload and manage your custom avatar through Cloudinary with deterministic per-user asset replacement.
*   **Clean Avatar Lifecycle:** Each user keeps one canonical Cloudinary profile image at `Chatly/profiles/{uid}`. Re-uploading a profile picture overwrites the same asset instead of creating a new random file every time.
*   **Contact & Personal Information:** Maintain and update your display bio, status presets, and personal details while strict analytical core identifiers (usernames, system emails) remain protected.
*   **Network Presence Indicators:** Continuous lifecycle tracking pipelines broadcasting automated granular *Last Seen* timestamp snapshots based on active network connection heartbeats.

### 🔒 Privacy & Security (Zero-Trust Identity)
*   **Inbound Connection Gateway:** To eliminate messaging overflow and unsolicited spamming, users cannot directly dump messages into an unknown recipient's workspace.
*   **The Handshake Protocol:** The initial transmission triggers a connection request state. The recipient conditionally blocks input capabilities, replacing them with `[Accept]` or `[Decline]`.
*   **OTP Verification Loops:** Dynamic security state dispatches a secure, server-side transactional One-Time Password (OTP) via email before granting main dashboard access.

---

## 💻 Comprehensive Tech Stack

Built entirely as a modern **Full-Stack Application**, handling both the rich client interface and secure backend APIs within a single unified repository.

### Framework & Core
*   **Next.js 16:** Utilizing the latest App Router architecture for seamless routing, server-side rendering, and backend API handlers.
*   **React 19:** Leveraging the latest React features and concurrent rendering capabilities.
*   **TypeScript:** Enforcing strict type safety, custom schemas, and self-documenting code.

### Backend, Database & Cloud
*   **Firebase Firestore:** Scalable NoSQL database with realtime listeners for instant chat synchronization.
*   **Firebase Cloud Messaging (FCM) & Firebase Admin:** Robust infrastructure to deliver real-time push notifications across all platforms.
*   **Service Workers:** Implemented for reliable background synchronization and push notification delivery even when the app is minimized or closed.
*   **Cloudinary:** High-performance cloud storage and CDN optimization for profile pictures and media uploads, organized under a dedicated `Chatly` folder.
*   **Nodemailer:** Reliable SMTP integrations to send automated OTP emails for Zero-Trust user authentication.

### Styling, UI & Animations
*   **Tailwind CSS (v4):** Utility-first styling framework driving the application's responsive, dual-theme (Light/Dark) design system.
*   **Framer Motion:** Powering fluid micro-animations, page transitions, and interactive chat interface elements.
*   **Lucide React & Phosphor Icons:** Clean, consistent, and scalable SVG iconography for all UI components.
*   **Sonner:** Highly customizable toast notifications for beautiful, unobtrusive user feedback.

### Infrastructure & Operations
*   **Vercel Analytics:** Native edge tracking to monitor user experience, performance, and visitor metrics.
*   **Vercel Edge Network:** Serverless deployment pipeline ensuring low-latency asset delivery and API execution worldwide.


---

## 🚀 Granular Message States & Real-Time Sync

*   **Dual-Tick Lifecycle Receipts:** Native document observers dynamically tracking and mutating data states across client instances:
    *   `[✓ Gray]` — Sent: Payload committed successfully onto the remote database clusters.
    *   `[✓✓ Gray]` — Delivered: Payload verified inside the specific platform architecture pipelines.
    *   `[✓✓ Green]` — Read: Reactive observer confirms the exact target user workspace view actively mounted the document into sight.
*   **Contextual Messaging Retries:** Deeply nested reactive data schemas fully supporting inline replies, multi-tier threads, and nested quotes pointing back to parent string IDs.
*   **Optimized Reactive Typing Subsystem:** Utilizing synchronized temporary presence maps in combination with aggressive debouncing algorithms to render live client typing signals (*"User is typing..."*) under minimal read-amplification overhead.
*   **Per-User Visibility Controls:** `deletedFor` tracks which users have locally removed a message, keeping delete-for-me behavior private to that user.
*   **Forward/Edit Metadata:** Forwarded and edited messages carry lightweight metadata (`forwarded`, `edited`, `editedAt`) so the UI can show the correct state without duplicating message models.

---

## Firestore Message Permissions

Chatly's message actions require Firestore rules that separate local visibility changes from global destructive changes:

*   **Delete for me / clear conversation:** Allowed through a narrow message update that only appends the current user's UID to `deletedFor`.
*   **Delete for everyone:** Allowed only when the authenticated user is the original `senderId` of the message.
*   **Edit message:** Allowed only for the original sender, only on text messages, and only within 3 minutes of the original `timestamp`.
*   **Forward message:** Uses normal message creation rules because the forwarded copy is a new message from the current user with `forwarded: true`.

If Firestore throws `Missing or insufficient permissions` while deleting, clearing, or editing messages, the deployed rules are usually missing one of these message update/delete permissions.

Recommended helper rules:

```js
function deletedForSelfOnly() {
  return request.resource.data.diff(resource.data).affectedKeys().hasOnly(['deletedFor'])
    && request.resource.data.deletedFor is list
    && request.auth.uid in request.resource.data.deletedFor
    && (
      !('deletedFor' in resource.data)
        ? request.resource.data.deletedFor.hasOnly([request.auth.uid])
        : request.resource.data.deletedFor.hasAll(resource.data.deletedFor)
          && request.resource.data.deletedFor.size() <= resource.data.deletedFor.size() + 1
    );
}

function messageEditBySenderWithinWindow() {
  return request.resource.data.diff(resource.data).affectedKeys().hasOnly(['text', 'edited', 'editedAt'])
    && resource.data.senderId == request.auth.uid
    && resource.data.type == "text"
    && request.resource.data.text is string
    && request.resource.data.text.size() > 0
    && request.resource.data.edited == true
    && request.resource.data.editedAt == request.time
    && request.time <= resource.data.timestamp + duration.value(3, "m");
}
```

Private chat messages should allow:

```js
allow update: if isChatParticipant(chatId)
  && (deletedForSelfOnly() || messageEditBySenderWithinWindow());

allow delete: if isChatParticipant(chatId)
  && resource.data.senderId == request.auth.uid;
```

Group messages should allow:

```js
allow update: if isGroupMemberParent(groupId)
  && (deletedForSelfOnly() || messageEditBySenderWithinWindow());

allow delete: if isGroupMemberParent(groupId)
  && resource.data.senderId == request.auth.uid;
```

---

## Cloudinary Asset Lifecycle

Chatly uses a controlled Cloudinary upload strategy for profile and group images instead of allowing every upload to create a random, permanent asset.

### Dedicated Folder Structure

```text
Chatly/
├── profiles/
│   └── {user.uid}
└── groups/
    └── {groupId}
```

### Why This Matters

*   **One user, one active profile image:** A user profile image is uploaded with the stable public ID `Chatly/profiles/{uid}`.
*   **Replacement instead of clutter:** When the same user uploads a new profile image, Cloudinary overwrites the existing asset instead of creating a heap of unused files.
*   **Cleaner storage:** The Cloudinary media library stays organized by application domain (`Chatly`) and asset type (`profiles`, `groups`).
*   **Predictable references:** Firestore stores the active `photoURL` and `photoPublicId`, so the app always points to the current image for that user.
*   **CDN refresh support:** Uploads use Cloudinary invalidation so replaced images can refresh cleanly across cached delivery URLs.

This follows the same general asset-lifecycle pattern used in large-scale product engineering, including companies in the Netflix/Meta/Google class: deterministic object keys for user-owned assets, overwrite mutable resources in place, and avoid unbounded storage growth from repeated profile updates. The exact internal implementation differs by company, but the principle is the same: stable IDs, predictable ownership, and storage hygiene.

---

## 📂 System Directory Mapping

```text
src/
├── app/                           # Core App Router Structural Layouts
│   ├── api/                       # Next.js Full-Stack Backend API Routes
│   │   ├── auth/                  # Authentication & OTP Routes
│   │   ├── notify/                # Firebase FCM Push Notification Handlers
│   │   └── upload/                # Profile Picture Upload Handlers (Cloudinary)
│   ├── layout.tsx                 # Global HTML & Body System Wrappers
│   ├── chat/
│   │   └── page.tsx               # Main Independent High-End Chat Dashboard Workspace
│   └── (landing)/                 # Route Grouping: Injects shared Header & Footer pipelines
│       ├── layout.tsx             # Shared Structure for public marketing pages
│       ├── page.tsx               # High-Conversion Corporate Landing View
│       ├── login/
│       │   └── page.tsx           # Authentication Entry Gateway
│       └── register/
│           └── page.tsx           # Signup Interface + Translucent OTP UI Overlay
│
├── components/                    # Atomic Component Architecture
│   ├── landing/                   # Modular Marketing UI Subsections
│   ├── chat/                      # Chat Interface & Messaging Components
│   ├── auth/                      # Authentication & Security Components
│   └── ui/                        # Reusable Control Nodes & Primitive System Units
│
├── lib/                           # Core Utilities, Firebase Config, & Services
├── context/                       # Global State Management & Providers
└── styles/
    └── globals.css                # Base Tailwind layer with auto-detect hardware color tokens
```
