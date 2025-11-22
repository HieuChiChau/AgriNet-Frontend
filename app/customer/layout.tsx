"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { CustomerNavItems } from "@/constants/navigation";
import { DashboardLayoutShell } from "@/components/templates/dashboard-layout-shell";
import { useLogoutMutation } from "@/hooks/mutations/use-auth";

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DashboardLayoutShell
      title="AgriNet"
      subtitle="AgriNet Customer"
      userLabel="Khách hàng"
      navItems={CustomerNavItems}
      onLogout={handleLogout}
      userName={user?.name}
      rootPath={pathname || "/customer"}
      userBadgeGradientClass="from-yellow-400 to-yellow-500"
    >
      {children}
    </DashboardLayoutShell>
  );
}
