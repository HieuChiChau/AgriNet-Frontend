"use client";

import { useEffect, useState } from "react";
import { postService } from "@/lib/services";
import { Post } from "@/types/post";
import { useToast } from "@/hooks/use-toast";
import { PostList } from "@/components/molecules/post-list";

export default function FarmerPostsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getPosts({
          page: 1,
          limit: 20,
        });
        if (response.status === "success") {
          setPosts(response.result.data);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách bài đăng",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

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

