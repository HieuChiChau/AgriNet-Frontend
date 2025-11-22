"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/atoms/toaster";
import { useUser } from "@/hooks/use-user";
import { AdminNavItems } from "@/constants/navigation";
import { DashboardLayoutShell } from "@/components/templates/dashboard-layout-shell";
import { useLogoutMutation } from "@/hooks/mutations/use-auth";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <NextTopLoader showSpinner={false} />
      <Toaster />
      <DashboardLayoutShell
        title="AgriNet"
        subtitle="AgriNet Admin"
        navItems={AdminNavItems}
        onLogout={handleLogout}
        userName={user?.name || "Admin"}
        rootPath={pathname || "/manage/dashboard"}
        userHomePath="/manage/dashboard"
      >
        {children}
      </DashboardLayoutShell>
    </>
  );
};

export default AdminLayout;
