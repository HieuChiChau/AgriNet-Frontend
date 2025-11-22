"use client";

import { PostList } from "@/components/molecules/post/post-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { useRecommendedPosts } from "@/hooks/query/posts";

export default function RecommendationsPage() {
  const { data, isLoading } = useRecommendedPosts();

  const posts = data?.status === "success" ? data.result.data : [];

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

