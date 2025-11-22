"use client";

import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { useForumPosts } from "@/hooks/query/forum";
import { Skeleton } from "@/components/atoms/skeleton";
import { MessageCircle } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
          <h3 className="text-sm font-semibold uppercase text-green-700">
            Bài nổi bật
          </h3>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-green-50 bg-white/70 p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}?from=forum`}
                className="group relative flex items-start gap-3 rounded-2xl border border-green-50 bg-gradient-to-br from-white/90 to-green-50/30 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >
                {/* Number badge */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-xs font-bold text-white shadow-sm">
                  {index + 1}
                </div>

                {/* Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-green-100 bg-green-50 shadow-sm">
                  {post.images?.[0] ? (
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Icons.media className="h-6 w-6 text-green-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {post.location.district && (
                      <span className="flex items-center gap-1">
                        <Icons.locations className="h-3 w-3" />
                        {post.location.district}
                      </span>
                    )}
                    {post.commentsCount > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentsCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

