"use client";

import { useQuery } from "@tanstack/react-query";
import { postService } from "@/lib/services";
import { PostSearchParams } from "@/types/post";
import { PostsResponse, PostResponse } from "@/lib/services/post.service";

const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params?: PostSearchParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string | number) => [...postKeys.details(), id] as const,
  myPosts: (params?: { page?: number; limit?: number }) =>
    [...postKeys.all, "my-posts", params] as const,
  recommended: () => [...postKeys.all, "recommended"] as const,
  search: (params?: PostSearchParams) =>
    [...postKeys.all, "search", params] as const,
  customers: (params?: {
    province?: string;
    district?: string;
    page?: number;
    limit?: number;
  }) => [...postKeys.all, "customers", params] as const,
  customerById: (id: string | number) =>
    [...postKeys.all, "customers", id] as const,
  users: (params?: {
    page?: number;
    limit?: number;
    name?: string;
    role?: number;
  }) => [...postKeys.all, "users", params] as const,
};

export function usePosts(params?: PostSearchParams) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postService.getPosts(params),
  });
}

export function usePost(id: string | number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPostById(id),
    enabled: !!id,
  });
}

export function useMyPosts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: postKeys.myPosts(params),
    queryFn: () => postService.getMyPosts(params),
    staleTime: 0,
  });
}

export function useRecommendedPosts() {
  return useQuery({
    queryKey: postKeys.recommended(),
    queryFn: () => postService.getRecommendedPosts(),
    enabled: false,
  });
}

export function useSearchPosts(params?: PostSearchParams) {
  return useQuery({
    queryKey: postKeys.search(params),
    queryFn: () => postService.searchPosts(params),
    enabled:
      !!params &&
      (Object.keys(params).length > 0 || params.keyword !== undefined),
  });
}

export function useCustomers(params?: {
  province?: string;
  district?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: postKeys.customers(params),
    queryFn: () => postService.getCustomers(params),
  });
}

export function useCustomer(id: string | number) {
  return useQuery({
    queryKey: postKeys.customerById(id),
    queryFn: () => postService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useUsers(params?: {
  page?: number;
  limit?: number;
  name?: string;
  role?: number;
}) {
  return useQuery({
    queryKey: postKeys.users(params),
    queryFn: () => postService.getUsers(params),
  });
}

export { postKeys };
