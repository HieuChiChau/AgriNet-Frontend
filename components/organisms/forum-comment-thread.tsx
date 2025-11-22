"use client";

import { ForumComment } from "@/types/forum";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";

interface ForumCommentThreadProps {
  comments: ForumComment[];
}

export function ForumCommentThread({ comments }: ForumCommentThreadProps) {
  const renderComment = (comment: ForumComment, depth = 0) => (
    <div
      key={comment.id}
      className="rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm"
      style={{ marginLeft: depth ? depth * 24 : 0 }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
          {comment.author.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {comment.author.name}
          </p>
          <p className="text-xs text-gray-500">
            {comment.author.location} ·{" "}
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{comment.content}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-green-50 pt-3">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
        <Icons.comment className="h-4 w-4" />
        Thảo luận ({comments.length})
      </div>
      {comments.map((comment) => renderComment(comment))}
    </div>
  );
}

