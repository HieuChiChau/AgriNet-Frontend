"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services";
import { CreatePostData, UpdatePostData } from "@/types/post";
import { postKeys } from "@/hooks/query/posts";
import { useToast } from "@/hooks/use-toast";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể tạo bài đăng",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdatePostData }) =>
      postService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật bài đăng",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể xóa bài đăng",
        variant: "destructive",
      });
    },
  });
}

export function useUploadPostImageMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => postService.uploadPostImage(file),
    onError: (error: any) => {
      toast({
        title: "Upload ảnh thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể upload ảnh",
        variant: "destructive",
      });
    },
  });
}
