import { Icons } from "@/components/icons";

export interface NavLinkItem {
  href: string;
  label: string;
  icon: keyof typeof Icons;
}

export const FarmerNavItems: NavLinkItem[] = [
  { href: "/farmer", label: "Trang chủ", icon: "dashboard" },
  { href: "/farmer/posts", label: "Bài đăng của tôi", icon: "post" },
  { href: "/farmer/create", label: "Đăng bài mới", icon: "add" },
  {
    href: "/farmer/customers",
    label: "Danh sách thương lái",
    icon: "providers",
  },
];

export const CustomerNavItems: NavLinkItem[] = [
  { href: "/customer", label: "Trang chủ", icon: "dashboard" },
  { href: "/customer/posts", label: "Tìm kiếm", icon: "search" },
  {
    href: "/customer/recommendations",
    label: "Gợi ý cho tôi",
    icon: "arrowRight",
  },
];

export const AdminNavItems: NavLinkItem[] = [
  { href: "/manage/dashboard", label: "Dashboard", icon: "dashboard" },
];
