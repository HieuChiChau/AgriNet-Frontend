"use client";

import { PostList } from "@/components/molecules/post/post-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { forumService } from "@/lib/services";
import { Post } from "@/types/post";
import { ForumPost } from "@/types/forum";

function transformForumPostToPost(forumPost: ForumPost): Post {
  return {
    id: forumPost.id,
    title: forumPost.title,
    description: forumPost.excerpt || forumPost.description,
    category: forumPost.category as any,
    price: forumPost.price || 0,
    quantity: forumPost.quantity || 0,
    unit: forumPost.unit || "kg",
    location: forumPost.location || {
      province: "",
      district: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    images: forumPost.images || [],
    status: forumPost.status || ("published" as any),
    farmer: forumPost.farmer,
    farmerId: forumPost.farmerId,
    createdAt: forumPost.createdAt || "",
    updatedAt: forumPost.updatedAt || "",
  };
}

export default function RecommendationsPage() {
  const { user } = useUser();

  const { data: forumPosts, isLoading } = useQuery({
    queryKey: ["recommended-posts", user?.latitude, user?.longitude, user?.address],
    queryFn: () => {
      if (!user?.latitude || !user?.longitude || !user?.address) {
        return Promise.resolve([]);
      }
      return forumService.getPosts({
        latitude: parseFloat(user.latitude),
        longitude: parseFloat(user.longitude),
        address: user.address,
      });
    },
    enabled: !!user && !!user.latitude && !!user.longitude && !!user.address,
  });

  const posts: Post[] = forumPosts ? forumPosts.map(transformForumPostToPost) : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Gợi ý cho bạn</h1>
        <p className="text-muted-foreground">
          Các sản phẩm phù hợp với nhu cầu của bạn được đề xuất bởi AI
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icons.arrowRight className="h-5 w-5 text-primary" />
            <CardTitle>Gợi ý thông minh</CardTitle>
          </div>
          <CardDescription>
            Hệ thống AI phân tích nhu cầu và vị trí của bạn để đề xuất các sản phẩm phù hợp nhất
          </CardDescription>
        </CardHeader>
      </Card>

      <PostList
        posts={posts}
        isLoading={isLoading}
        emptyMessage="Chưa có gợi ý nào. Hãy cập nhật thông tin của bạn để nhận được gợi ý tốt hơn!"
      />
    </div>
  );
}

