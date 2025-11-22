"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/constants/role";

const publicLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Diễn đàn", href: "/forum" },
];

const roleLinks: Record<UserRole, { label: string; href: string }[]> = {
  [UserRole.Admin]: [{ label: "Quản trị", href: "/manage/dashboard" }],
  [UserRole.Farmer]: [
    { label: "Bảng điều khiển", href: "/farmer" },
    { label: "Đăng bài", href: "/farmer/create" },
  ],
  [UserRole.Customer]: [
    { label: "Bảng điều khiển", href: "/customer" },
    { label: "Gợi ý cho tôi", href: "/customer/recommendations" },
  ],
};

export function SiteFooter() {
  const pathname = usePathname();
  const hiddenPrefixes = ["/farmer", "/customer", "/manage"];
  const shouldHide = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const { user } = useUser();

  const navLinks = useMemo(() => {
    if (!user) {
      return publicLinks;
    }
    return [...publicLinks, ...(roleLinks[user.role] ?? [])];
  }, [user]);

  if (shouldHide) {
    return null;
  }

  return (
    <footer className="border-t border-green-100 bg-white py-10">
      <div className="container flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
            <Icons.logo className="h-5 w-5 text-white" />
          </div>
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} AgriNet. Kết nối nông sản Việt.
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
