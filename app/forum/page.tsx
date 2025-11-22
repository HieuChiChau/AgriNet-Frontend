import Image from "next/image";
import { ForumPageClient } from "@/components/pages/forum/forum-page-client";

export const metadata = {
  title: "AgriNet Forum",
  description: "Nơi kết nối nông dân, thương lái và doanh nghiệp logistics.",
};

export default function ForumPage() {
  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50">
      <section className="container space-y-6 py-16">
        <div className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/80 p-10 text-center shadow-2xl backdrop-blur">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/assets/images/forum-hero-bg.svg"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/70 to-green-100/40" />
          </div>
          <div className="relative space-y-4">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 shadow">
              Pulse realtime
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Kết nối, chia sẻ và giao thương nông sản Việt
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600">
              Cập nhật nhanh bài đăng mới nhất từ cộng đồng nông dân & thương lái trên khắp cả nước. Chia sẻ kinh nghiệm, tìm đối tác và theo dõi tín hiệu thị trường theo thời gian thực.
            </p>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 text-left text-sm">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow">
                <p className="text-2xl font-semibold text-green-700">+480</p>
                <p className="text-gray-500">Bài đăng đang hoạt động</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow">
                <p className="text-2xl font-semibold text-green-700">34 tỉnh/thành</p>
                <p className="text-gray-500">Nguồn cung phủ khắp</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow">
                <p className="text-2xl font-semibold text-green-700">Realtime</p>
                <p className="text-gray-500">Dòng tin thị trường mỗi phút</p>
              </div>
            </div>
          </div>
        </div>

        <ForumPageClient />
      </section>
    </div>
  );
}

