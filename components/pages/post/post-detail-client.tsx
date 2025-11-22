"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePost } from "@/hooks/query/posts";
import { Post } from "@/types/post";
import { ProductCategory, PostStatus } from "@/types/post";
import { authService } from "@/lib/services";
import type { PostDetailResponse } from "@/lib/services/post.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { ForumPostGallery } from "@/components/molecules/forum/post-gallery";
import { PostCommentSection } from "@/components/organisms/post-comment-section";

function transformPostDetailToPost(detail: PostDetailResponse["result"]): Post {
  return {
    id: detail.id,
    title: detail.title,
    description: detail.content,
    category: detail.category
      ? (detail.category.name as ProductCategory)
      : ProductCategory.OTHER,
    price: detail.embedding?.price
      ? parseFloat(detail.embedding.price.replace(/[^\d.]/g, ""))
      : 0,
    quantity: detail.embedding?.quantity
      ? parseFloat(detail.embedding.quantity.replace(/[^\d.]/g, ""))
      : 0,
    unit: detail.embedding?.quantity?.includes("kg")
      ? "kg"
      : detail.embedding?.quantity?.includes("tấn")
        ? "tấn"
        : "kg",
    location: {
      province: detail.user.address
        ? detail.user.address.split(",").slice(-2, -1)[0]?.trim() || ""
        : "",
      district: detail.user.address
        ? detail.user.address.split(",").slice(-3, -2)[0]?.trim() || ""
        : "",
      address: detail.user.address || "",
      coordinates: {
        lat: parseFloat(detail.user.latitude) || 0,
        lng: parseFloat(detail.user.longitude) || 0,
      },
    },
    images: detail.images.map((img) => img.url),
    status: PostStatus.PUBLISHED,
    farmer: authService.transformUser({
      id: detail.user.id,
      email: detail.user.email,
      firstName: detail.user.firstName,
      lastName: detail.user.lastName,
      phone: detail.user.phone,
      avatar: detail.user.avatar,
      latitude: detail.user.latitude,
      longitude: detail.user.longitude,
      address: detail.user.address,
      role: detail.user.role,
      status: detail.user.status,
    }),
    farmerId: detail.user.id,
    createdAt: "",
    updatedAt: "",
  };
}

interface PostDetailClientProps {
  postId: string;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
  const router = useRouter();
  const { data, isLoading, isError } = usePost(postId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-green-700">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (isError || !data || data.status !== "success") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Không tìm thấy bài viết
        </p>
        <p className="text-sm text-gray-500">
          Bài viết có thể đã bị xóa hoặc không tồn tại.
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const post = transformPostDetailToPost(data.result);

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50">
      <article className="container space-y-8 py-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <Link
            href="/farmer/posts"
            className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/90 px-3 py-1 text-green-700 shadow-sm transition hover:border-green-200 hover:text-green-800"
          >
            <Icons.chevronLeft className="h-4 w-4" />
            Quay lại
          </Link>
          <span className="hidden text-gray-400 sm:block">/</span>
          <span className="hidden max-w-[260px] truncate text-gray-600 sm:block">
            {post.title}
          </span>
        </div>

        <Card className="border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-green-700">{post.title}</CardTitle>
            <CardDescription className="text-base mt-4 whitespace-pre-wrap">
              {post.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {post.images && post.images.length > 0 && (
              <ForumPostGallery title={post.title} images={post.images} />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icons.locations className="h-5 w-5 text-green-600" />
                <span>{post.location.address || `${post.location.district}, ${post.location.province}`}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icons.user className="h-5 w-5 text-green-600" />
                <span>{post.farmer.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment Section */}
        <PostCommentSection />
      </article>
    </div>
  );
}

