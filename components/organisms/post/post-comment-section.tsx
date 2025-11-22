"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/molecules/common/pagination";
import { useCreateCommentMutation } from "@/hooks/mutations/comments";
import { useComments } from "@/hooks/query/comments";
import { useUser } from "@/hooks/use-user";
import { authService } from "@/lib/services";
import type { CommentItem } from "@/lib/services/comment.service";
import { Loader2 } from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

const COMMENTS_PER_PAGE = 10;

interface PostCommentSectionProps {
  postId: string;
}

function transformCommentItem(item: CommentItem): Comment {
  const transformedUser = authService.transformUser(item.user);
  const location = item.user.address
    ? item.user.address.split(",").slice(-2, -1)[0]?.trim() || ""
    : undefined;

  return {
    id: item.id,
    author: {
      name: transformedUser.name,
      avatar: transformedUser.avatar || undefined,
      location,
    },
    content: item.content,
    createdAt: item.createdAt,
    replies:
      item.childComments && item.childComments.length > 0
        ? item.childComments.map(transformCommentItem)
        : undefined,
  };
}

export function PostCommentSection({ postId }: PostCommentSectionProps) {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const createCommentMutation = useCreateCommentMutation();

  const {
    data: commentsData,
    isLoading,
    isError,
    refetch,
  } = useComments({
    postId,
    page: currentPage,
    limit: COMMENTS_PER_PAGE,
  });

  const comments = commentsData?.result?.items || [];
  const totalComments = commentsData?.result?.total || 0;
  const totalPages = commentsData?.result?.totalPage || 1;
  const displayedComments = comments.map(transformCommentItem);

  const getTimeAgo = (createdAt: string): string => {
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        return "Vừa xong";
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return "Vừa xong";
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: vi,
      });
    } catch (error) {
      return "Vừa xong";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: newComment.trim(),
      });

      setNewComment("");
      refetch();
    } catch (error) {
    }
  };

  const handleReplySubmit = async (parentCommentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        parentCommentId,
        content: replyContent.trim(),
      });

      setReplyContent("");
      setReplyingTo(null);
      refetch();
    } catch (error) {
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isReply = depth > 0;
    const canReply = depth === 0;
    return (
      <div
        key={comment.id}
        className={cn(
          "rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm",
          isReply && "ml-8 mt-3"
        )}
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold text-sm">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {comment.author.name}
            </p>
            <p className="text-xs text-gray-500">
              {comment.author.location && `${comment.author.location} · `}
              {getTimeAgo(comment.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>

        {canReply && (
          <div className="mt-3">
            {replyingTo === comment.id ? (
              <form
                onSubmit={(e) => handleReplySubmit(comment.id, e)}
                className="mt-3 space-y-2"
              >
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi..."
                  className="border-green-200 focus:border-green-400"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim() || createCommentMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    Gửi
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Icons.comment className="h-3.5 w-3.5 mr-1" />
                Trả lời
              </Button>
            )}
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-green-50 pt-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-green-100 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
          <Icons.comment className="h-5 w-5" />
          Bình luận ({totalComments})
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold text-sm flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="border-green-200 focus:border-green-400"
                  disabled={createCommentMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {createCommentMutation.isPending ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 text-center text-sm text-gray-600">
            Vui lòng{" "}
            <a href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              đăng nhập
            </a>{" "}
            để bình luận
          </div>
        )}

        {/* Comments list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-3" />
            <p className="text-sm text-gray-500">Đang tải bình luận...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-gray-500">
            <Icons.comment className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Không thể tải bình luận. Vui lòng thử lại sau.</p>
          </div>
        ) : displayedComments.length > 0 ? (
          <div className="space-y-4">
            {displayedComments.map((comment) => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icons.comment className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        )}
      </CardContent>
    </Card>
  );
}
