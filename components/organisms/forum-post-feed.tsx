"use client";

import { useMemo, useState } from "react";
import { ProductCategory } from "@/types/post";
import { PostSearch } from "@/components/molecules/post-search";
import { ForumPostCard } from "@/components/molecules/forum-post-card";
import { SearchPostFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { useForumPosts } from "@/hooks/query/forum";
import { Skeleton } from "@/components/atoms/skeleton";

export function ForumPostFeed() {
  const { data: postsData = [], isLoading } = useForumPosts();
  const [searchParams, setSearchParams] = useState<SearchPostFormData | null>(
    null
  );
  const [quickCategory, setQuickCategory] = useState<ProductCategory | null>(
    null
  );

  const handleSearch = (params: SearchPostFormData) => {
    setSearchParams(params);
    if (params.category) {
      setQuickCategory(params.category);
    }
  };

  const trendingCategories = useMemo(() => {
    const counts = postsData.reduce<Record<ProductCategory, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<ProductCategory, number>);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category]) => category as ProductCategory);
  }, [postsData]);

  const categoryLabels: Record<ProductCategory, string> = {
    rice: "Lúa gạo",
    vegetables: "Rau củ",
    fruits: "Trái cây",
    coffee: "Cà phê",
    cassava: "Sắn",
    corn: "Ngô",
    other: "Khác",
  };

  const filteredPosts = useMemo(() => {
    const keyword = searchParams?.keyword?.toLowerCase();
    const category = quickCategory ?? searchParams?.category;

    return postsData.filter((post) => {
      const matchesKeyword = keyword
        ? post.title.toLowerCase().includes(keyword) ||
        post.excerpt.toLowerCase().includes(keyword)
        : true;

      const matchesCategory = category ? post.category === category : true;

      return matchesKeyword && matchesCategory;
    });
  }, [postsData, searchParams, quickCategory]);

  const combinedPosts = useMemo(
    () =>
      filteredPosts.map((post) => ({
        ...post,
        farmer: post.farmer,
      })),
    [filteredPosts]
  );

  const handleQuickCategory = (category: ProductCategory | null) => {
    setQuickCategory((prev) => (prev === category ? null : category));
    if (!category && searchParams?.category) {
      setSearchParams({ ...searchParams, category: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
        <div className="mt-6 rounded-3xl border border-green-50 bg-white/80 p-4 shadow-inner">
          <PostSearch onSearch={handleSearch} />
          {trendingCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-600">
                Lọc nhanh
              </p>
              <button
                type="button"
                onClick={() => handleQuickCategory(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  !quickCategory
                    ? "border-green-500 bg-green-100 text-green-800 shadow"
                    : "border-green-100 text-gray-500 hover:border-green-300 hover:text-green-700"
                )}
              >
                Tất cả
              </button>
              {trendingCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleQuickCategory(category)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    quickCategory === category
                      ? "border-green-500 bg-green-100 text-green-800 shadow"
                      : "border-green-100 text-gray-500 hover:border-green-300 hover:text-green-700"
                  )}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          )}
        </div>
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
            {combinedPosts.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
          {combinedPosts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white/70 p-10 text-center">
              <p className="text-sm text-gray-600">
                Không tìm thấy bài phù hợp. Vui lòng thử từ khóa khác.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

