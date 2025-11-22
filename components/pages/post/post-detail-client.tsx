"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePost } from "@/hooks/query/posts";
import { Post } from "@/types/post";
import { ProductCategory, PostStatus } from "@/types/post";
import { authService } from "@/lib/services";
import type { PostDetailResponse } from "@/lib/services/post.service";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { ForumPostGallery } from "@/components/molecules/forum/post-gallery";
import { PostCommentSection } from "@/components/organisms/post/post-comment-section";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

function transformPostDetailToPost(detail: PostDetailResponse["result"]): Post {
  const postAddress = detail.address || detail.user.address || "";
  const postLatitude = detail.latitude || detail.user.latitude || "";
  const postLongitude = detail.longitude || detail.user.longitude || "";

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
      province: postAddress
        ? postAddress.split(",").slice(-2, -1)[0]?.trim() || ""
        : "",
      district: postAddress
        ? postAddress.split(",").slice(-3, -2)[0]?.trim() || ""
        : "",
      address: postAddress,
      coordinates: {
        lat: parseFloat(postLatitude) || 0,
        lng: parseFloat(postLongitude) || 0,
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
    createdAt: detail.createdAt || "",
    updatedAt: detail.updatedAt || "",
  };
}

interface PostDetailClientProps {
  postId: string;
  from?: string;
}

export function PostDetailClient({ postId, from }: PostDetailClientProps) {
  const router = useRouter();
  const { data, isLoading, isError } = usePost(postId);

  const getBackUrl = () => {
    if (from === "forum") {
      return "/forum";
    }
    return null;
  };

  const backUrl = getBackUrl();

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
  const detail = data.result;
  const postAddress = detail.address || detail.user.address || "";

  const getTimeAgo = (dateString?: string) => {
    if (!dateString || dateString.trim() === "") return "";
    try {
      // Parse ISO 8601 date string (ví dụ: "2025-11-22T17:45:22.939Z")
      const date = new Date(dateString);
      const now = new Date();

      // Kiểm tra date có hợp lệ không
      if (isNaN(date.getTime())) {
        return "";
      }

      // Tính toán chênh lệch thời gian (milliseconds)
      const diffInMs = now.getTime() - date.getTime();

      // Nếu date trong tương lai (có thể do lỗi), trả về empty
      if (diffInMs < 0) {
        return "";
      }

      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInMs / 60000);
      const diffInHours = Math.floor(diffInMs / 3600000);
      const diffInDays = Math.floor(diffInMs / 86400000);

      if (diffInSeconds < 60) {
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

      // Với thời gian dài hơn, dùng formatDistanceToNow
      const result = formatDistanceToNow(date, { addSuffix: false, locale: vi });
      return `${result} trước`;
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50 min-h-screen">
      <article className="container space-y-6 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {backUrl ? (
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/90 px-3 py-1.5 text-green-700 shadow-sm transition hover:border-green-200 hover:text-green-800"
            >
              <Icons.chevronLeft className="h-4 w-4" />
              Quay lại
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/90 px-3 py-1.5 text-green-700 shadow-sm transition hover:border-green-200 hover:text-green-800"
            >
              <Icons.chevronLeft className="h-4 w-4" />
              Quay lại
            </button>
          )}
          <span className="hidden text-gray-400 sm:block">/</span>
          <span className="hidden max-w-[260px] truncate text-gray-600 sm:block">
            {post.title}
          </span>
        </div>

        {/* Main Card - Facebook Style */}
        <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
          {/* Header - Facebook Style */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Avatar */}
                {post.farmer.avatar ? (
                  <Image
                    src={post.farmer.avatar}
                    alt={post.farmer.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white text-sm font-bold flex-shrink-0">
                    {post.farmer.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name, Time, Location */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                      {post.farmer.name}
                    </h3>
                    {detail.category && (
                      <>
                        <span className="text-gray-500">·</span>
                        <span className="text-sm text-green-600 font-medium">
                          {detail.category.name}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 flex-wrap">
                    {detail.createdAt && (
                      <>
                        <span>{getTimeAgo(detail.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* More Options */}
              <button className="p-1.5 rounded-full hover:bg-gray-100 transition">
                <Icons.ellipsis className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </CardHeader>

          {/* Contact Info - At the top */}
          {(detail.user.phone || postAddress) && (
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex flex-col gap-3">
                {detail.user.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 flex-shrink-0">
                      <Icons.phone className="h-4 w-4 text-green-600" />
                    </div>
                    <a
                      href={`tel:${detail.user.phone}`}
                      className="text-green-600 hover:text-green-700 hover:underline font-medium text-sm"
                    >
                      {detail.user.phone}
                    </a>
                  </div>
                )}
                {postAddress && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 flex-shrink-0 mt-0.5">
                      <Icons.locations className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{postAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content - Above Images */}
          <CardContent className="pt-4 pb-4">
            {/* Title - More prominent */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h2>

            {/* Description/Content - Clearly different */}
            {post.description && (
              <div className="text-base md:text-lg text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 font-normal">
                {post.description}
              </div>
            )}

            {/* Images - Below Content */}
            {post.images && post.images.length > 0 && (
              <div className="mt-4 -mx-4 sm:-mx-6">
                <ForumPostGallery title={post.title} images={post.images} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comment Section */}
        <PostCommentSection postId={postId} />
      </article>
    </div>
  );
}

