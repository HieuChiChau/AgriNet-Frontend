"use client";

import { useQuery } from "@tanstack/react-query";
import { forumService } from "@/lib/services";
import { ForumPost } from "@/types/forum";

const forumKeys = {
  posts: ["forum", "posts"] as const,
  postById: (id: string | number) => ["forum", "posts", id] as const,
  commentsByPost: (id: string | number) =>
    ["forum", "posts", id, "comments"] as const,
};

interface UseForumPostsParams {
  categoryName?: string;
  productName?: string;
  price?: string;
  quantity?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export function useForumPosts(params?: UseForumPostsParams) {
  return useQuery({
    queryKey: [...forumKeys.posts, params],
    queryFn: () => forumService.getPosts(params),
    staleTime: 0,
  });
}

export function useForumPost(id: string | number) {
  return useQuery({
    queryKey: forumKeys.postById(id),
    queryFn: () => forumService.getPostById(id),
    enabled: !!id,
  });
}

export function useForumComments(postId: string | number, enabled = true) {
  return useQuery({
    queryKey: forumKeys.commentsByPost(postId),
    queryFn: () => forumService.getCommentsByPostId(postId),
    enabled: !!postId && enabled,
  });
}
