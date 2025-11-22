"use client";

import { useState } from "react";
import { ProductCategory } from "@/types/post";
import { ForumPostCard } from "@/components/molecules/forum/forum-post-card";
import { cn } from "@/lib/utils";
import { useForumPosts } from "@/hooks/query/forum";
import { Skeleton } from "@/components/atoms/skeleton";
import { ForumFilter } from "@/components/molecules/forum/forum-filter";

interface ForumFilterParams {
  categoryName?: string;
  productName?: string;
  price?: string;
  quantity?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export function ForumPostFeed() {
  const [filterParams, setFilterParams] = useState<ForumFilterParams>({});
  const { data: postsData = [], isLoading } = useForumPosts(filterParams);

  const handleFilter = (params: ForumFilterParams) => {
    setFilterParams(params);
  };


  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
        <ForumFilter onFilter={handleFilter} isLoading={isLoading} />
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-64 rounded-3xl bg-white/70" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {postsData.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
          {postsData.length === 0 && (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white/70 p-10 text-center">
              <p className="text-sm text-gray-600">
                Không tìm thấy bài phù hợp. Vui lòng thử bộ lọc khác.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

