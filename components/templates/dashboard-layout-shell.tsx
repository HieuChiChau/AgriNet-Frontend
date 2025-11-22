"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/icons";
import { NavLinkItem } from "@/constants/navigation";
import { useMobileMenu } from "@/hooks/use-mobile-menu";

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
}: DashboardLayoutShellProps) {
  const { isOpen, toggle, close } = useMobileMenu();
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

  const userInfoBlock = (
    <div className="mb-4 flex items-center gap-3 px-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${userBadgeGradientClass} text-white`}
      >
        <Icons.user className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {userName || subtitle}
        </p>
        <p className="text-xs text-green-600 font-medium">{userLabel}</p>
      </div>
    </div>
  );

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
        <div className="mt-auto w-full border-t border-green-100 bg-white p-4">
          {userInfoBlock}
          <Button
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50"
            onClick={onLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Content area with mobile navigation */}
      <div className="flex flex-1 flex-col">
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
            <div className="mt-4 border-t border-green-100 pt-3">
              {userInfoBlock}
              <Button
                variant="outline"
                className="mt-2 w-full border-green-200 text-green-700 hover:bg-green-50"
                onClick={onLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

