"use client";

import { useState } from "react";
import { postService } from "@/lib/services";
import { Post, PostSearchParams } from "@/types/post";
import { useToast } from "@/hooks/use-toast";
import { PostList } from "@/components/molecules/post-list";
import { PostSearch } from "@/components/molecules/post-search";

export default function CustomerPostsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (params: PostSearchParams) => {
    try {
      setIsLoading(true);
      const response = await postService.searchPosts(params);
      if (response.status === "success") {
        setPosts(response.result.data);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm bài đăng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Tìm kiếm sản phẩm</h1>
        <p className="text-muted-foreground">
          Tìm kiếm nông sản phù hợp với nhu cầu của bạn
        </p>
      </div>

      <PostSearch onSearch={handleSearch} isLoading={isLoading} />

      <PostList
        posts={posts}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy sản phẩm nào. Hãy thử tìm kiếm với từ khóa khác!"
      />
    </div>
  );
}

