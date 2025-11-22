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

export function useForumPosts() {
  return useQuery({
    queryKey: forumKeys.posts,
    queryFn: () => forumService.getPosts(),
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
