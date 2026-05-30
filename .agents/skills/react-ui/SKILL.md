---
name: design-taste-frontend
description: Rules for generating high-end, stunning frontend interfaces with professional dashboards, fluid layouts, and smooth spring physics animations. Use when crafting UI or writing React animation code.
---

# Frontend Design Taste & Fluid Animation Guidelines

## 1. Stack Limitations
- Framework: Next.js (App Router), React, Tailwind CSS (v4 prefered, fallback to v3 if lockfile states so).
- Motion Engine: Framer Motion (or Modern Motion SDK).
- Icons: exclusively use `@phosphor-icons/react` or `@radix-ui/react-icons` with a uniform 1.5 stroke width. No emojis allowed.

## 2. Anti-Generic Visual Constraints
- **No Pure Black:** Use Charcoal, Zinc-950, or Off-black (`#09090b`).
- **No Over-Saturated Accents:** Keep brand colors sleek and desaturated to blend beautifully with dark/light themes.
- **Glassmorphism Spec:** Use subtle backdrop blurs, crisp inner-borders, and tint shadows. Never use massive outer-glow drop-shadows.
- **Viewport Stability:** Never use `h-screen` for hero sections or wrappers. Always use `min-h-[100dvh]` to prevent viewport jumping on mobile.

## 3. Motion & Animation Physics
- **No Linear Easing:** All transitions must feel organic and weighty. Use Spring physics.
- **Config Baseline:** `type: "spring", stiffness: 120, damping: 22, mass: 1`
- **Micro-Interactions:** Elements should subtly react to pointer proximity, click states, and active focus paths.

---
name: premium-chat-ui
description: Design principles for modernizing Chatly from a flat AI template into a fluid, responsive, luxury chat application using subtle glassmorphism and spring physics.
---

# Chatly Design Language Specs

## 1. Color Palette Deprecation & Refresh
- **DEPRECATE:** Saturated neon green buttons (`#00cbb0`) with giant blurry glow drops.
- **ADOPT:** Emerald Mint (`#10b981` / `rgba(16, 185, 129, 0.1)`) used strictly for state indicators and fine interactive accents.
- **DEPRECATE:** Uniform flat pitch-black panel backdrops.
- **ADOPT:** Layered dark depths: Base background (`#0b0c10`), Sidebar surfaces (`#12141c`), active states (`#1e2230`).

## 2. Layout & Typography Adjustments
- Inter-element layout borders must be `border-zinc-800/40` or `border-white/[0.04]`.
- Text tracking: Use `tracking-tight` on main dashboard headers and drop font weights down to `font-medium` or `font-semibold` instead of generic ultra-thick `font-black`.

## 3. Interaction Mechanics
- Hover states must use spring physics: `stiffness: 300, damping: 25`.
- Active tabs/chats must utilize shared layout animations via Framer Motion's `layoutId`.