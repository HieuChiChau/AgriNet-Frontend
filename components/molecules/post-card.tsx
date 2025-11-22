import Link from "next/link";
import { Post, ProductCategory } from "@/types/post";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.RICE]: "Lúa gạo",
  [ProductCategory.VEGETABLES]: "Rau củ",
  [ProductCategory.FRUITS]: "Trái cây",
  [ProductCategory.COFFEE]: "Cà phê",
  [ProductCategory.CASSAVA]: "Sắn",
  [ProductCategory.CORN]: "Ngô",
  [ProductCategory.OTHER]: "Khác",
};

const categoryColors: Record<ProductCategory, string> = {
  [ProductCategory.RICE]: "bg-amber-100 text-amber-700 border-amber-200",
  [ProductCategory.VEGETABLES]: "bg-green-100 text-green-700 border-green-200",
  [ProductCategory.FRUITS]: "bg-orange-100 text-orange-700 border-orange-200",
  [ProductCategory.COFFEE]: "bg-amber-200 text-amber-800 border-amber-300",
  [ProductCategory.CASSAVA]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [ProductCategory.CORN]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [ProductCategory.OTHER]: "bg-gray-100 text-gray-700 border-gray-200",
};

export function PostCard({ post, className }: PostCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
            <Badge
              className={cn(
                "absolute top-2 right-2 border",
                categoryColors[post.category]
              )}
            >
              {categoryLabels[post.category]}
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 text-green-700 group-hover:text-green-600 transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {post.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {formatPrice(post.price)}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              /{post.unit}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Icons.locations className="h-4 w-4 text-green-600" />
              <span>{post.location.district}, {post.location.province}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.product className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">{post.quantity} {post.unit}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm border-t border-green-50 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white text-xs font-bold">
              {post.farmer.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-600 font-medium">{post.farmer.name}</span>
          </div>
          {post.views !== undefined && (
            <span className="text-gray-500 flex items-center gap-1">
              <Icons.media className="h-3.5 w-3.5" />
              {post.views}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
