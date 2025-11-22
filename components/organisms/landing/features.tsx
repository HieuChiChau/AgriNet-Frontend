import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Icons } from "@/components/icons";

const featureItems = [
  {
    title: "Dự báo thị trường AI",
    description:
      "Sử dụng trí tuệ nhân tạo để dự báo giá cả và nhu cầu thị trường, giúp nông dân quyết định thời điểm bán tốt nhất.",
    icon: Icons.zones,
    gradient: "from-green-400 to-green-500",
  },
  {
    title: "Kết nối thông minh",
    description:
      "Đề xuất kết nối tối ưu giữa người trồng, nhà thu mua và logistics dựa trên vị trí, nhu cầu và lịch trình.",
    icon: Icons.map,
    gradient: "from-yellow-400 to-yellow-500",
  },
  {
    title: "Giảm chi phí vận chuyển",
    description:
      "Tối ưu hóa logistics giúp giảm 30% chi phí vận chuyển, nâng cao sức cạnh tranh cho nông sản Việt.",
    icon: Icons.providers,
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "Nền tảng Forum",
    description:
      "Người bán đăng bài, người mua tìm sản phẩm phù hợp. Kết nối trực tiếp, minh bạch.",
    icon: Icons.product,
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Tìm kiếm theo vị trí",
    description:
      "Tìm sản phẩm và đối tác gần bạn nhất, tối ưu hóa thời gian và khoảng cách giao hàng.",
    icon: Icons.locations,
    gradient: "from-green-400 to-green-500",
  },
  {
    title: "Gợi ý thông minh",
    description:
      "Hệ thống AI đề xuất bài đăng phù hợp với nhu cầu từng người dùng, tiết kiệm thời gian tìm kiếm.",
    icon: Icons.arrowRight,
    gradient: "from-yellow-400 to-yellow-500",
  },
];

export function LandingFeatures() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 -z-10 opacity-60">
        <Image
          src="/assets/images/landing-pattern.svg"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="container space-y-12">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
              Vận hành toàn diện
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Mọi tính năng đều xoay quanh việc kết nối nhanh – minh bạch – hiệu quả
            </h2>
            <p className="text-gray-600">
              Chúng tôi kết hợp dữ liệu thời gian thực, AI dự báo và mạng lưới logistics để tạo ra trải nghiệm liền mạch cho nông dân, thương lái và doanh nghiệp.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -top-4 -right-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
              <Image
                src="/assets/images/landing-hero-illustration.svg"
                alt="Minh hoạ tính năng"
                width={360}
                height={270}
                className="rounded-3xl shadow-2xl ring-1 ring-white/40"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureItems.map((item) => (
            <Card
              key={item.title}
              className="border-white/60 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 transition-all hover:-translate-y-1 hover:border-green-200 hover:shadow-2xl"
            >
              <CardHeader>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-green-700">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

