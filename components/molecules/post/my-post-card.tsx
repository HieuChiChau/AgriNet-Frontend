"use client";

import { Post } from "@/types/post";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { PostActions } from "./post-actions";
import Link from "next/link";

interface MyPostCardProps {
  post: Post;
  className?: string;
}

export function MyPostCard({ post, className }: MyPostCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-xl transition-all duration-300 h-full border-green-100 hover:border-green-300 group flex flex-col",
      className
    )}>
      {post.images && post.images.length > 0 && (
        <Link href={`/posts/${post.id}?from=farmer`}>
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.images[0]}
              alt={post.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </Link>
      )}
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/posts/${post.id}?from=farmer`} className="flex-1">
            <CardTitle className="text-green-700 group-hover:text-green-600 transition-colors cursor-pointer">
              {post.title}
            </CardTitle>
          </Link>
        </div>
        <CardDescription className="line-clamp-3 text-sm mt-2 min-h-[3.75rem]">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Icons.locations className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="line-clamp-1">
            {post?.location?.address || "-"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-green-50 pt-4 mt-auto flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white text-xs font-bold flex-shrink-0">
            {post.farmer?.firstName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-600 font-medium truncate text-sm">
            {post.farmer?.firstName} {post.farmer?.lastName}
          </span>
        </div>
        <PostActions postId={post.id} />
      </CardFooter>
    </Card>
  );
}

