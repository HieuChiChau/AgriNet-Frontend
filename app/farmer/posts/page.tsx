"use client";

import type { MyPost } from "@/lib/services/post.service";
import { Post } from "@/types/post";
import { PostList } from "@/components/molecules/post/post-list";
import { ProductCategory, PostStatus } from "@/types/post";
import { authService } from "@/lib/services";
import { useMyPosts } from "@/hooks/query/posts";

function transformMyPostToPost(myPost: MyPost): Post {
  return {
    id: myPost.id,
    title: myPost.title,
    description: myPost.content,
    category: myPost.category
      ? (myPost.category.name as ProductCategory)
      : ProductCategory.OTHER,
    price: myPost.embedding?.price
      ? parseFloat(myPost.embedding.price.replace(/[^\d.]/g, ""))
      : 0,
    quantity: myPost.embedding?.quantity
      ? parseFloat(myPost.embedding.quantity.replace(/[^\d.]/g, ""))
      : 0,
    unit: myPost.embedding?.quantity?.includes("kg")
      ? "kg"
      : myPost.embedding?.quantity?.includes("tấn")
        ? "tấn"
        : "kg",
    location: {
      province: myPost.user.address
        ? myPost.user.address.split(",").slice(-2, -1)[0]?.trim() || ""
        : "",
      district: myPost.user.address
        ? myPost.user.address.split(",").slice(-3, -2)[0]?.trim() || ""
        : "",
      address: myPost.user.address || "",
      coordinates: {
        lat: parseFloat(myPost.user.latitude) || 0,
        lng: parseFloat(myPost.user.longitude) || 0,
      },
    },
    images: myPost.images.map((img) => img.url),
    status: PostStatus.PUBLISHED,
    farmer: authService.transformUser({
      id: myPost.user.id,
      email: myPost.user.email,
      firstName: myPost.user.firstName,
      lastName: myPost.user.lastName,
      phone: myPost.user.phone,
      avatar: myPost.user.avatar,
      latitude: myPost.user.latitude,
      longitude: myPost.user.longitude,
      address: myPost.user.address,
      role: myPost.user.role,
      status: myPost.user.status,
    }),
    farmerId: myPost.user.id,
    createdAt: "",
    updatedAt: "",
  };
}

export default function FarmerPostsPage() {
  const { data, isLoading } = useMyPosts({
    page: 1,
    limit: 20,
  });

  const posts =
    data?.status === "success"
      ? data.result.data.map(transformMyPostToPost)
      : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Bài đăng của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả các bài đăng của bạn
        </p>
      </div>

      <PostList
        posts={posts}
        isLoading={isLoading}
        emptyMessage="Bạn chưa có bài đăng nào. Hãy tạo bài đăng mới!"
      />
    </div>
  );
}

