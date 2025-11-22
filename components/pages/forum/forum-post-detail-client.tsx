"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ForumPostDetailTemplate } from "@/components/templates/forum/forum-post-detail";
import { useForumPost, useForumComments } from "@/hooks/query/forum";
import { forumService } from "@/lib/services";

interface ForumPostDetailClientProps {
  postId: string;
}

export function ForumPostDetailClient({ postId }: ForumPostDetailClientProps) {
  const router = useRouter();
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useForumPost(postId);
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
  } = useForumComments(postId, !!post);

  const authorLocation = useMemo(() => {
    if (!post) return undefined;
    const profile = forumService.getAuthorById(post.farmerId);
    return profile?.location;
  }, [post]);

  if (isPostLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-green-700">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (isPostError || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Không tìm thấy bài viết
        </p>
        <p className="text-sm text-gray-500">
          Bài viết có thể đã bị xóa hoặc chuyển sang chế độ riêng tư.
        </p>
        <button
          type="button"
          onClick={() => router.push("/forum")}
          className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          Quay lại diễn đàn
        </button>
      </div>
    );
  }

  return (
    <ForumPostDetailTemplate
      post={post}
      comments={comments}
      authorLocation={authorLocation}
      isCommentsLoading={isCommentsLoading}
    />
  );
}

