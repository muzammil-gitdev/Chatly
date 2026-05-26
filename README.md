# 💬 Chatly — Serverless Real-Time Messaging Platform

**Chatly** is a high-performance, serverless real-time messaging application designed with a robust dual-layer permission system, hierarchical group structures, and reactive state management. Built explicitly using **Next.js 15 (App Router)** and **TypeScript**, the architecture leverages native edge environments and client-directed synchronization loops to provide an ultra-responsive, WhatsApp-like desktop and mobile ecosystem.

---

## 🛠️ Architectural Stack

*   **Frontend Framework:** Next.js (React 19, App Router architecture)
*   **Language:** TypeScript (Strictly typed schemas and interfaces)
*   **Styling Engine:** Tailwind CSS (Native dark & light mode tokens mapped to hardware preferences)
*   **Database & Core Pipeline:** Firebase Firestore (Structured sub-collections & realtime reactive states)
*   **Deployment Pipeline:** Vercel Edge Serverless Infrastructure

---

## 🚀 Key Engineering Features & Specifications

### 1. Inbound Connection Gateway (LinkedIn-Style Permission Routing)
*   **Non-Intrusive DMs:** To eliminate messaging overflow and unsolicited spamming, users cannot directly dump messages into an unknown recipient's workspace.
*   **The Handshake Protocol:** The initial transmission triggers an immutable connection request state. The recipient's core viewport conditionally blocks input capabilities, replacing them with binary action modules: `[Accept]` or `[Decline]`. 
*   **Unlocking Pipelines:** Full conversational parameters and active synchronization pipelines remain entirely dead/disabled until an explicit recipient acceptance signature is logged.

### 2. Hierarchical Multi-Tenant Groups & Streams
*   **Granular Authorization:** Out-of-the-box structural authority maps out Group Creators/Admins from generalized members. Admins retain strict functional privileges to add, prune, or re-route user identities within explicit channel IDs.
*   **Sovereign Exits:** Individual participants are bound to modular autonomy, allowing them to independently terminate their node connection and leave groups at any lifecycle timestamp.
*   **System Activity Logs:** Native mutations (e.g., membership additions, deliberate exits, or administrative evictions) are compiled as isolated systemic events (`type: "system"` metadata documents), rendered as unique mid-stream timeline logs instead of standard text-chat interfaces.

### 3. Granular Message States & Real-Time Sync
*   **Dual-Tick Lifecycle Receipts:** Native document observers dynamically tracking and mutating data states across client instances:
    *   `[✓ Gray]` — Sent: Payload committed successfully onto the remote database clusters.
    *   `[✓✓ Gray]` — Delivered: Payload verified inside the specific platform architecture pipelines.
    *   `[✓✓ Green]` — Read: Reactive observer confirms the exact target user workspace view actively mounted the document into sight.
*   **Contextual Messaging Retries:** Deeply nested reactive data schemas fully supporting inline replies, multi-tier threads, and nested quotes pointing back to parent string IDs.
*   **Optimized Reactive Typing Subsystem:** Utilizing synchronized temporary presence maps in combination with aggressive debouncing algorithms to render live client typing signals (*"User is typing..."*) under minimal read-amplification overhead.

### 4. Zero-Trust Identity Verification (OTP Pipeline)
*   **Transactional Verification Loops:** The registration timeline prevents dirty reads and unverified identity caching inside the main database. 
*   **Dynamic Security State:** Submitting credentials dispatches a secure, automated, server-side transactional One-Time Password (OTP) sequence directly over the targeted user's SMTP inbox. Access to the main dashboard layer is absolutely gated until the client verifies the transient code.
*   **Volatile Vault Management:** Fully decoupled password recovery pipelines managing temporal tokens allowing self-service secure keys resetting.

### 5. Adaptive User Workspaces & Sessions
*   **Profile Control Boundaries:** Encapsulated update protocols granting direct manipulation over user presentation properties (Avatars, Display Bio, Status Presets) while strictly freezing analytical core identifiers (Immutable Usernames and Primary System Emails).
*   **Network Presence Indicators:** Continuous lifecycle tracking pipelines broadcasting automated granular `Last Seen` timestamp snapshots based on active network connection heartbeats.
*   **Session Clearance Protocol:** Fully automated secure cache erasure and immediate listener termination hooks triggering cleanly upon explicit user logout events.

---

## 📂 System Directory Mapping

```text
src/
├── app/                           # Core App Router Structural Layouts
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
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   └── ui/                        # Reusable Control Nodes & Primitive System Units
│       ├── ThemeToggle.tsx
│       ├── Button.tsx
│       └── Input.tsx
│
└── styles/
    └── globals.css                # Base Tailwind layer with auto-detect hardware color tokens


    🎨 Theme Synchronization
Chatly implements a zero-flicker Automated Theme Switcher Engine configured directly via hardware tokens. By utilizing native media queries inside globals.css, the application automatically matches browser configuration modes seamlessly without layout shifts:

Solar Light Profile: Formulated for high-glare environments using strict slate tones (#f8fafc) and crisp, clean typography structures.

Deep Tech Dark Profile: Mapped out on custom gray-to-black gradient palettes (#0B0F19) utilizing high-contrast green accent variations to enhance readability and ensure minimal ocular fatigue during prolonged programming or operations workflows.