import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import { requireAdmin } from "@/lib/admin/auth";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 300;

async function getOverview() {
  const [usersSnap, groupsSnap] = await Promise.all([
    adminDb.collection("users").get(),
    adminDb.collection("groups").get(),
  ]);
  let activeUsers = 0;
  let suspendedUsers = 0;
  usersSnap.docs.forEach((doc) => {
    const data = doc.data();
    if (data.isSuspended) suspendedUsers += 1;
    else if (data.isActivated) activeUsers += 1;
  });
  return { activeUsers, suspendedUsers, groups: groupsSnap.size };
}

export default async function AdminDashboardPage() {
  const [session, overview] = await Promise.all([requireAdmin(), getOverview()]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-500">Admin Portal</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">Welcome back, {session.email}</p>
      </div>

      <AnalyticsPanel overview={overview} />
    </div>
  );
}
