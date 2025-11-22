import Link from "next/link";
import { Post } from "@/types/post";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className={cn(
        "hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-green-100 hover:border-green-300 hover:-translate-y-1 group",
        className
      )}>
        {post.images && post.images.length > 0 && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.images[0]}
              alt={post.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}
        <CardHeader>
          <CardTitle className=" text-green-700 group-hover:text-green-600 transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {post.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Icons.locations className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="line-clamp-1">
              {post?.location?.address || "-"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-2 text-sm border-t border-green-50 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white text-xs font-bold flex-shrink-0">
            {post.farmer?.firstName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-600 font-medium truncate">
            {post.farmer?.firstName}{" "}{post.farmer?.lastName}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
