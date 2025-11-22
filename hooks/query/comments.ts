"use client";

import { useQuery } from "@tanstack/react-query";
import {
  commentService,
  GetCommentsParams,
} from "@/lib/services/comment.service";
import { commentKeys } from "@/hooks/mutations/comments";

export function useComments(params: GetCommentsParams) {
  return useQuery({
    queryKey: commentKeys.byPost(params.postId),
    queryFn: () => commentService.getComments(params),
    enabled: !!params.postId,
  });
}
