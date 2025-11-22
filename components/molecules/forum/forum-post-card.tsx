"use client";

import Link from "next/link";
import { ForumPost } from "@/types/forum";
import { Badge } from "@/components/atoms/badge";
import { Icons } from "@/components/icons";
import { HeartHandshake, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ForumPostCardProps {
  post: ForumPost;
}

function getTimeAgo(dateString?: string) {
  if (!dateString || dateString.trim() === "") return "";
  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return "";
    }

    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) {
      return "Vừa xong";
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    const result = formatDistanceToNow(date, { addSuffix: false, locale: vi });
    return `${result} trước`;
  } catch {
    return "";
  }
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <Link href={`/posts/${post.id}?from=forum`}>
      <article className="group rounded-2xl border border-green-100 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-green-700">
          <Badge variant="secondary" className="bg-green-100">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-gray-500">
            <Icons.locations className="h-3.5 w-3.5" />
            {post.location.district}, {post.location.province}
          </span>
          {timeAgo && (
            <span className="flex items-center gap-1 text-gray-500">
              <Icons.clock className="h-3.5 w-3.5" />
              {timeAgo}
            </span>
          )}
          <span className="flex items-center gap-1 text-gray-500">
            <Icons.media className="h-3.5 w-3.5" />
            {post.views ?? 0} lượt xem
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-700">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 min-h-[5rem]">{post.excerpt}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
              {post.farmer.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.farmer.name}</p>
              <p className="text-xs text-gray-500">
                {post.location.district}, {post.location.province}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HeartHandshake className="h-4 w-4 text-green-600" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-green-600" />
              {post.commentsCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

