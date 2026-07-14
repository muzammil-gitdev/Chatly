import UserManagement from "@/components/admin/UserManagement";
import { requireAdmin } from "@/lib/admin/auth";

export const revalidate = 300;

export default async function AdminUsersPage() {
  await requireAdmin();
  return <UserManagement />;
}
