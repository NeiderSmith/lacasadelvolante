import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Administración",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 antialiased">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
