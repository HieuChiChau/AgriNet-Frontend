"use client";

import { useState } from "react";
import { PostSearchParams } from "@/types/post";
import { PostList } from "@/components/molecules/post/post-list";
import { PostSearch } from "@/components/molecules/post/post-search";
import { useSearchPosts, usePosts } from "@/hooks/query/posts";

export default function CustomerPostsPage() {
  const [searchParams, setSearchParams] = useState<PostSearchParams | undefined>();
  const searchQuery = useSearchPosts(searchParams);
  const defaultQuery = usePosts({ page: 1, limit: 20 });

  const hasSearchParams = searchParams && Object.keys(searchParams).length > 0;
  const { data, isLoading } = hasSearchParams ? searchQuery : defaultQuery;

  const posts = data?.status === "success" ? data.result.data : [];

  const handleSearch = (params: PostSearchParams) => {
    setSearchParams(params);
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

