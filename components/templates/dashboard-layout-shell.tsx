"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/atoms/dropdown-menu";
import { Icons } from "@/components/icons";
import { NavLinkItem } from "@/constants/navigation";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/constants/role";

interface DashboardLayoutShellProps {
  title: string;
  subtitle: string;
  userLabel: string;
  backgroundClass?: string;
  logoGradientClass?: string;
  userBadgeGradientClass?: string;
  navItems: NavLinkItem[];
  children: ReactNode;
  onLogout: () => void;
  userName?: string | null;
  rootPath: string;
  userHomePath: string;
}

const defaultBg = "from-green-50 via-white to-yellow-50";
const defaultLogoGradient = "from-green-500 to-green-600";
const defaultUserBadgeGradient = "from-green-400 to-green-500";

export function DashboardLayoutShell({
  title,
  subtitle,
  userLabel,
  backgroundClass = defaultBg,
  logoGradientClass = defaultLogoGradient,
  userBadgeGradientClass = defaultUserBadgeGradient,
  navItems,
  children,
  onLogout,
  userName,
  rootPath,
  userHomePath,
}: DashboardLayoutShellProps) {
  const { isOpen, toggle, close } = useMobileMenu();
  const { user } = useUser();
  const normalizedPath =
    rootPath && rootPath !== "/" ? rootPath.replace(/\/$/, "") : rootPath;

  const combinedNavItems = [
    ...navItems,
    { href: "/forum", label: "Diễn đàn", icon: "help" as keyof typeof Icons },
  ];

  const activeHref = combinedNavItems.reduce((best, item) => {
    const normalizedHref =
      item.href !== "/" ? item.href.replace(/\/$/, "") : item.href;
    const isExact = normalizedPath === normalizedHref;
    const isNested =
      normalizedHref !== "/" &&
      normalizedPath?.startsWith(`${normalizedHref}/`);
    if ((isExact || isNested) && normalizedHref.length > best.length) {
      return normalizedHref;
    }
    return best;
  }, "");

  const renderNavLinks = (onClickItem?: () => void) =>
    combinedNavItems.map((item) => {
      const IconComponent = Icons[item.icon];
      const normalizedHref =
        item.href !== "/" ? item.href.replace(/\/$/, "") : item.href;
      const isActive =
        normalizedPath === normalizedHref || normalizedHref === activeHref;

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
            : "text-gray-700 hover:bg-green-50 hover:text-green-700"
            }`}
          onClick={onClickItem}
        >
          <IconComponent className="h-5 w-5" />
          {item.label}
        </Link>
      );
    });


  return (
    <div className={`flex min-h-screen bg-gradient-to-br ${backgroundClass}`}>
      {/* Desktop sidebar */}
      <aside className="relative hidden w-64 border-r border-green-100 bg-gradient-to-b from-green-50/50 to-white md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-green-100 bg-white px-6">
          <Link href={rootPath} className="flex items-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${logoGradientClass}`}
            >
              <Icons.logo className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {title}
            </span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">{renderNavLinks()}</nav>
      </aside>

      {/* Content area with mobile navigation */}
      <div className="flex flex-1 flex-col">
        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-between border-b border-green-100 bg-white px-6 shadow-sm md:flex">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{subtitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold">
                      {user.name?.charAt(0).toUpperCase() || user.firstName?.charAt(0).toUpperCase() || "U"}
                    </span>
                    {userName || user.name || user.firstName || "Tài khoản"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={userHomePath}>Trang của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Chỉnh sửa hồ sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/forum">Diễn đàn</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-green-100 bg-white px-4 shadow-sm md:hidden">
          <Link href={rootPath} className="flex items-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${logoGradientClass}`}
            >
              <Icons.logo className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-green-700">{subtitle}</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-green-200 bg-white text-green-700 shadow-sm"
            onClick={toggle}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span className="block h-[2px] w-5 rounded-full bg-green-700" />
              <span className="block h-[2px] w-5 rounded-full bg-green-700" />
              <span className="block h-[2px] w-5 rounded-full bg-green-700" />
            </div>
          </button>
        </header>

        {isOpen && (
          <div className="border-b border-green-100 bg-white px-4 py-3 shadow-sm md:hidden">
            <div className="space-y-2">
              {renderNavLinks(() => close())}
            </div>
            {user && (
              <div className="mt-4 border-t border-green-100 pt-3 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 text-green-700"
                  onClick={close}
                >
                  <Link href={userHomePath}>Trang của tôi</Link>
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
                    onLogout();
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
        )}

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

