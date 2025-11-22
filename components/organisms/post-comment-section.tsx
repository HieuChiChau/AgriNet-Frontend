"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/molecules/pagination";

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

// Data cứng cho comments - tạo nhiều comments để test pagination
const generateMockComments = (): Comment[] => {
  const comments: Comment[] = [];
  const names = [
    "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E",
    "Ngô Thị F", "Đỗ Văn G", "Bùi Thị H", "Vũ Văn I", "Đặng Thị K",
    "Lý Văn L", "Võ Thị M", "Trương Văn N", "Phan Thị O", "Lương Văn P",
  ];
  const locations = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
  const contents = [
    "Sản phẩm này chất lượng tốt, tôi đã mua và rất hài lòng!",
    "Giá cả hợp lý, có thể thương lượng thêm không?",
    "Bạn có thể giao hàng đến địa chỉ của tôi không?",
    "Sản phẩm có đảm bảo chất lượng không?",
    "Tôi muốn mua số lượng lớn, có giảm giá không?",
    "Thời gian giao hàng bao lâu?",
    "Sản phẩm này có nguồn gốc rõ ràng không?",
    "Cảm ơn bạn đã chia sẻ thông tin!",
    "Tôi rất quan tâm đến sản phẩm này.",
    "Có thể xem mẫu trước khi mua không?",
  ];

  for (let i = 1; i <= 25; i++) {
    const hasReply = i % 3 === 0;
    comments.push({
      id: `${i}`,
      author: {
        name: names[i % names.length],
        location: locations[i % locations.length],
      },
      content: contents[i % contents.length],
      createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
      ...(hasReply && {
        replies: [
          {
            id: `${i}-1`,
            author: {
              name: names[(i + 1) % names.length],
              location: locations[(i + 1) % locations.length],
            },
            content: "Cảm ơn bạn đã phản hồi!",
            createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          },
        ],
      }),
    });
  }

  return comments;
};

const mockComments: Comment[] = generateMockComments();

const COMMENTS_PER_PAGE = 5;

export function PostCommentSection() {
  const [allComments] = useState<Comment[]>(mockComments);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");

  // Tính toán comments hiển thị
  const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const displayedComments = useMemo(
    () => allComments.slice(startIndex, endIndex),
    [allComments, startIndex, endIndex]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // TODO: Xử lý submit comment khi có API
    setNewComment("");
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <div
      key={comment.id}
      className={cn(
        "rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm",
        depth > 0 && "ml-8 mt-3"
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold text-sm">
          {comment.author.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {comment.author.name}
          </p>
          <p className="text-xs text-gray-500">
            {comment.author.location && `${comment.author.location} · `}
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-green-50 pt-3">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="border-green-100 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
          <Icons.comment className="h-5 w-5" />
          Bình luận ({allComments.length})
        </div>

        {/* Comment form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white font-semibold text-sm flex-shrink-0">
              U
            </div>
            <div className="flex-1">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="border-green-200 focus:border-green-400"
              />
            </div>
            <Button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Gửi
            </Button>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          {displayedComments.length > 0 ? (
            displayedComments.map((comment) => renderComment(comment))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icons.comment className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
          )}
        </div>

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

