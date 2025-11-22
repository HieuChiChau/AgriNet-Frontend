"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/atoms/dropdown-menu";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/constants/role";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useLogoutMutation } from "@/hooks/mutations/use-auth";

const publicLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Diễn đàn", href: "/forum" },
];

const roleLinks: Record<UserRole, { label: string; href: string }[]> = {
  [UserRole.Admin]: [
    { label: "Quản trị", href: "/manage/dashboard" },
  ],
  [UserRole.Farmer]: [
    { label: "Bảng điều khiển", href: "/farmer" },
    { label: "Bài đăng của tôi", href: "/farmer/posts" },
    { label: "Đăng bài", href: "/farmer/create" },
  ],
  [UserRole.Customer]: [
    { label: "Bảng điều khiển", href: "/customer" },
    { label: "Tìm kiếm", href: "/customer/posts" },
    { label: "Gợi ý cho tôi", href: "/customer/recommendations" },
  ],
};

const dashboardPrefixes = ["/farmer", "/customer", "/manage"];

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const { isOpen, toggle, close } = useMobileMenu();
  const logoutMutation = useLogoutMutation();

  const shouldHide = dashboardPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const navLinks = useMemo(() => {
    if (!user) {
      return publicLinks;
    }
    const specific = roleLinks[user.role] ?? [];
    return [...publicLinks, ...specific];
  }, [user]);

  const userHome = useMemo(() => {
    if (!user) return null;
    const specific = roleLinks[user.role]?.[0];
    return specific?.href ?? "/";
  }, [user]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (shouldHide) {
    return null;
  }

  const renderNavLinks = (onClick?: () => void) =>
    navLinks.map((item) => {
      const isActive =
        item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors",
            isActive
              ? "text-green-700"
              : "text-gray-600 hover:text-green-700"
          )}
          onClick={onClick}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <header className="border-b border-green-100 bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
            <Icons.logo className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            AgriNet
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user && userHome ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  {user.name || "Tài khoản"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={userHome}>Trang của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Chỉnh sửa hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/forum">Diễn đàn</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm                                            font-medium text-gray-600 transition hover:text-green-700"
              >
                Đăng nhập
              </Link>
              <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Link href="/signup">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-green-200 text-green-700"
          onClick={toggle}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-[2px] w-5 rounded-full bg-green-700" />
            <span className="block h-[2px] w-5 rounded-full bg-green-700" />
            <span className="block h-[2px] w-5 rounded-full bg-green-700" />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-green-100 bg-white px-4 py-4">
          <div className="flex flex-col gap-3">
            {renderNavLinks(close)}
            {user && userHome ? (
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 text-green-700"
                  onClick={close}
                >
                  <Link href={userHome}>Trang của tôi</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 text-green-700"
                  onClick={close}
                >
                  <Link href="/profile">Chỉnh sửa hồ sơ</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700"
                  onClick={() => {
                    close();
                    handleLogout();
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 text-green-700"
                  onClick={close}
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={close}
                >
                  <Link href="/signup">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

