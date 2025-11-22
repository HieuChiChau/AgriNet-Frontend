import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";
import {
  Post,
  CreatePostData,
  UpdatePostData,
  PostSearchParams,
  Customer,
} from "@/types/post";

export interface PostsResponse {
  status: string;
  result: {
    data: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface PostResponse {
  status: string;
  result: Post;
  message?: string;
}

export interface CustomersResponse {
  status: string;
  result: {
    data: Customer[];
    total: number;
  };
  message?: string;
}

export const postService = {
  // Get all posts
  getPosts: async (params?: PostSearchParams): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(ApiUrl.POSTS, {
      params,
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id: string | number): Promise<PostResponse> => {
    const response = await httpRequest.get<PostResponse>(ApiUrl.POST_BY_ID(id));
    return response.data;
  },

  // Create post
  createPost: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await httpRequest.post<PostResponse>(
      ApiUrl.CREATE_POST,
      data
    );
    return response.data;
  },

  // Update post
  updatePost: async (
    id: string | number,
    data: UpdatePostData
  ): Promise<PostResponse> => {
    const response = await httpRequest.put<PostResponse>(
      ApiUrl.UPDATE_POST(id),
      data
    );
    return response.data;
  },

  // Delete post
  deletePost: async (
    id: string | number
  ): Promise<{ status: string; message?: string }> => {
    const response = await httpRequest.delete(ApiUrl.DELETE_POST(id));
    return response.data;
  },

  // Search posts
  searchPosts: async (params: PostSearchParams): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(ApiUrl.SEARCH_POSTS, {
      params,
    });
    return response.data;
  },

  // Get recommended posts
  getRecommendedPosts: async (): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(
      ApiUrl.RECOMMENDED_POSTS
    );
    return response.data;
  },

  // Get customers list
  getCustomers: async (params?: {
    province?: string;
    district?: string;
    page?: number;
    limit?: number;
  }): Promise<CustomersResponse> => {
    const response = await httpRequest.get<CustomersResponse>(
      ApiUrl.CUSTOMERS,
      {
        params,
      }
    );
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (
    id: string | number
  ): Promise<{
    status: string;
    result: Customer;
    message?: string;
  }> => {
    const response = await httpRequest.get(ApiUrl.CUSTOMER_BY_ID(id));
    return response.data;
  },
};
