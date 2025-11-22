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

export interface PostDetailResponse {
  status: string;
  message: string;
  result: {
    id: string;
    title: string;
    content: string;
    category: {
      id: string;
      name: string;
      image: string;
    } | null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      avatar: string | null;
      latitude: string;
      longitude: string;
      address: string;
      role: number;
      status: number;
    };
    images: {
      id: string;
      fileName: string | null;
      url: string;
    }[];
    embedding: {
      id: string;
      productName: string;
      price: string;
      quantity: string;
    } | null;
  };
}

export interface CustomersResponse {
  status: string;
  result: {
    data: Customer[];
    total: number;
  };
  message?: string;
}

export interface UploadPostImageResponse {
  status: string;
  message: string;
  result: {
    filename: string;
    fileUrl: string;
  };
}

export interface MyPostImage {
  id: string;
  fileName: string | null;
  url: string;
}

export interface MyPostCategory {
  id: string;
  name: string;
  image: string;
}

export interface MyPostEmbedding {
  id: string;
  productName: string;
  price: string;
  quantity: string;
}

export interface MyPost {
  id: string;
  title: string;
  content: string;
  category: MyPostCategory | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    latitude: string;
    longitude: string;
    address: string;
    role: number;
    status: number;
  };
  images: MyPostImage[];
  embedding: MyPostEmbedding | null;
}

export interface MyPostsResponse {
  status: string;
  message: string;
  result: {
    data: MyPost[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

export const postService = {
  getPosts: async (params?: PostSearchParams): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(ApiUrl.POSTS, {
      params,
    });
    return response.data;
  },

  getPostById: async (id: string | number): Promise<PostDetailResponse> => {
    const response = await httpRequest.get<PostDetailResponse>(
      ApiUrl.POST_BY_ID(id)
    );
    return response.data;
  },

  createPost: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await httpRequest.post<PostResponse>(
      ApiUrl.CREATE_POST,
      data
    );
    return response.data;
  },

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

  deletePost: async (
    id: string | number
  ): Promise<{ status: string; message?: string }> => {
    const response = await httpRequest.delete(ApiUrl.DELETE_POST(id));
    return response.data;
  },

  searchPosts: async (params: PostSearchParams): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(ApiUrl.SEARCH_POSTS, {
      params,
    });
    return response.data;
  },

  getRecommendedPosts: async (): Promise<PostsResponse> => {
    const response = await httpRequest.get<PostsResponse>(
      ApiUrl.RECOMMENDED_POSTS
    );
    return response.data;
  },

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

  uploadPostImage: async (file: File): Promise<UploadPostImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpRequest.post<UploadPostImageResponse>(
      ApiUrl.UPLOAD_POST_IMAGE,
      formData
    );
    return response.data;
  },

  getMyPosts: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<MyPostsResponse> => {
    const response = await httpRequest.get<MyPostsResponse>(
      ApiUrl.GET_MY_POSTS,
      {
        params,
      }
    );
    return response.data;
  },
};
