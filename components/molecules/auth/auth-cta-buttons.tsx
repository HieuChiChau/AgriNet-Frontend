"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/constants/role";

function getDashboardPath(role?: UserRole): string | null {
  switch (role) {
    case UserRole.Farmer:
      return "/farmer";
    case UserRole.Customer:
      return "/customer";
    case UserRole.Admin:
      return "/manage/dashboard";
    default:
      return null;
  }
}

interface AuthCTAButtonsProps {
  variant?: "hero" | "cta";
}

export function AuthCTAButtons({ variant = "hero" }: AuthCTAButtonsProps) {
  const { user } = useUser();
  const dashboardPath = getDashboardPath(user?.role);

  const primaryClass =
    variant === "hero"
      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg";

  const secondaryClass =
    variant === "hero"
      ? "border-green-300 text-green-700 hover:bg-green-50"
      : "border-green-300 text-green-700 hover:bg-green-50";

  if (dashboardPath) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild className={primaryClass}>
          <Link href={dashboardPath}>Đi tới trang của tôi</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className={secondaryClass}>
          <Link href="/forum">Xem diễn đàn</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button size="lg" asChild className={primaryClass}>
        <Link href="/signup">Bắt đầu ngay</Link>
      </Button>
      <Button size="lg" variant="outline" asChild className={secondaryClass}>
        <Link href="/login">Đăng nhập</Link>
      </Button>
    </div>
  );
}

