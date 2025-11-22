"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services";
import { CustomerNavItems } from "@/constants/navigation";
import { DashboardLayoutShell } from "@/components/templates/dashboard-layout-shell";

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
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
