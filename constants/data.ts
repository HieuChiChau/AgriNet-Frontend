import { NavItem } from "@/types";

export const navItemsSuperAdmin: NavItem[] = [
  {
    title: "User",
    href: "/manage/user",
    icon: "user",
    label: "User",
  },
  {
    title: "Tenant",
    href: "/manage/tenant",
    icon: "user",
    label: "Tenant",
  },
];

export const navItemsTenantAdmin: NavItem[] = [
  {
    title: "Assets",
    icon: "assets",
    href: "#",
    label: "Assets",
    children: [
      {
        title: "Categories",
        href: "/manage/assets/categories",
        icon: "categories",
        label: "Categories",
      },
      {
        title: "Items",
        href: "/manage/assets/items",
        icon: "items",
        label: "Items",
      },
    ],
  },
  {
    title: "Locations",
    icon: "locations",
    href: "#",
    label: "Locations",
    children: [
      {
        title: "Mains",
        href: "#",
        icon: "mains",
        label: "Mains",
      },
      {
        title: "Sections",
        href: "#",
        icon: "sections",
        label: "Sections",
      },
      {
        title: "Subs",
        href: "#",
        icon: "subs",
        label: "Subs",
      },
      {
        title: "Zones",
        href: "#",
        icon: "zones",
        label: "Zones",
      },
    ],
  },
  {
    title: "Providers",
    href: "#",
    icon: "providers",
    label: "Providers",
  },
  {
    title: "Contracts",
    href: "#",
    icon: "contracts",
    label: "Contracts",
  },
  {
    title: "Jobs",
    href: "#",
    icon: "jobs",
    label: "Jobs",
  },
  {
    title: "Users",
    icon: "user",
    href: "#",
    label: "Users",
    children: [
      {
        title: "Providers",
        href: "#",
        icon: "providers",
        label: "Providers",
      },
      {
        title: "Technicians",
        href: "#",
        icon: "technicians",
        label: "Technicians",
      },
    ],
  },
];

export const currencyCultureCodes = {
  USD: "en-US", // United States Dollar
  EUR: "de-DE", // Euro (using German as a common European locale)
  JPY: "ja-JP", // Japanese Yen
  GBP: "en-GB", // British Pound Sterling
  AUD: "en-AU", // Australian Dollar
  CAD: "en-CA", // Canadian Dollar
  CHF: "de-CH", // Swiss Franc
  CNY: "zh-CN", // Chinese Yuan
  SEK: "sv-SE", // Swedish Krona
  NZD: "en-NZ", // New Zealand Dollar
  MXN: "es-MX", // Mexican Peso
  SGD: "en-SG", // Singapore Dollar
  HKD: "zh-HK", // Hong Kong Dollar
  NOK: "nb-NO", // Norwegian Krone
  KRW: "ko-KR", // South Korean Won
  TRY: "tr-TR", // Turkish Lira
  RUB: "ru-RU", // Russian Ruble
  INR: "hi-IN", // Indian Rupee
  BRL: "pt-BR", // Brazilian Real
  ZAR: "en-ZA", // South African Rand
  VND: "vi-VN", // Vietnamese Dong
  IDR: "id-ID", // Indonesian Rupiah
  THB: "th-TH", // Thai Baht
  MYR: "ms-MY", // Malaysian Ringgit
  PHP: "fil-PH", // Philippine Peso
  DKK: "da-DK", // Danish Krone
};
