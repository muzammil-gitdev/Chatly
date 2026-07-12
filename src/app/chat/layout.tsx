import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/components/ui/QueryProvider";
import { Toaster } from "sonner";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}
