"use client";

import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { useForumPosts } from "@/hooks/query/forum";
import { Skeleton } from "@/components/atoms/skeleton";

export function ForumSidebar() {
  const { data: posts = [], isLoading } = useForumPosts();
  const trendingPosts = posts.slice(0, 4);
  const categories = Array.from(
    new Set(posts.map((post) => post.category))
  ).slice(0, 6);

  return (
    <aside className="space-y-6 rounded-4xl border border-white/60 bg-white/85 p-6 shadow-xl backdrop-blur-lg">
      <div className="rounded-3xl border border-green-50 bg-gradient-to-br from-green-50/80 to-yellow-50/70 p-5 shadow-inner">
        <div className="flex items-center gap-3 text-green-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow">
            <Icons.chart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
              Nhịp thị trường
            </p>
            <p className="text-sm text-gray-600">Tín hiệu nóng trong 24h qua</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-gray-700">
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2 shadow-sm">
            <span>Giá rau ăn lá</span>
            <span className="font-semibold text-green-600">+8.2%</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2 shadow-sm">
            <span>Nguồn cung cà phê</span>
            <span className="font-semibold text-amber-600">-12%</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2 shadow-sm">
            <span>Đơn logistics</span>
            <span className="font-semibold text-green-600">+36 chuyến</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase text-green-700">
          Danh mục nổi bật
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-green-100 bg-green-50/70 px-3 py-1 text-xs font-medium text-green-700 shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase text-green-700">
          Bài nổi bật
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 rounded-2xl bg-white/70" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}?from=forum`}
                className="flex items-center gap-3 rounded-2xl border border-green-50 bg-white/70 p-3 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50/80"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-green-100">
                  <Image
                    src={post.images?.[0] || "/assets/images/forum-hero-bg.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

