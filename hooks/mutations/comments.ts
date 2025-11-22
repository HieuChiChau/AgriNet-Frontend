"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService, CreateCommentPayload } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";

const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: string | number) =>
    [...commentKeys.all, "post", postId] as const,
};

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentService.createComment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(variables.postId),
      });
      toast({
        title: "Thành công",
        description: "Bình luận đã được đăng thành công!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể đăng bình luận",
        variant: "destructive",
      });
    },
  });
}

export { commentKeys };
