"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/atoms/toaster";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services";
import { AdminNavItems } from "@/constants/navigation";
import { DashboardLayoutShell } from "@/components/templates/dashboard-layout-shell";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      router.push("/");
      toast({ title: "Đăng xuất thành công" });
    } catch (error) {
      toast({ title: "Đăng xuất thất bại", variant: "destructive" });
    }
  };

  return (
    <>
      <NextTopLoader showSpinner={false} />
      <Toaster />
      <DashboardLayoutShell
        title="AgriNet"
        subtitle="AgriNet Admin"
        userLabel="Quản trị viên"
        navItems={AdminNavItems}
        onLogout={handleLogout}
        userName={user?.name || "Admin"}
        rootPath={pathname || "/manage/dashboard"}
      >
        {children}
      </DashboardLayoutShell>
    </>
  );
};

export default AdminLayout;
