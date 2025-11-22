import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";

export interface CreateCommentPayload {
  postId: string;
  parentCommentId?: string | null;
  content: string;
}

export interface CommentResponse {
  status: string;
  message: string;
  result: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface CommentUser {
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
}

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  childComments: CommentItem[];
  user: CommentUser;
}

export interface GetCommentsParams {
  postId: string;
  page?: number;
  limit?: number;
}

export interface GetCommentsResponse {
  status: string;
  message: string;
  result: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    items: CommentItem[];
  };
}

export const commentService = {
  createComment: async (
    payload: CreateCommentPayload
  ): Promise<CommentResponse> => {
    const requestPayload: Record<string, string> = {
      postId: payload.postId,
      content: payload.content,
    };

    if (payload.parentCommentId) {
      requestPayload.parentCommentId = payload.parentCommentId;
    }

    const response = await httpRequest.post<CommentResponse>(
      ApiUrl.CREATE_COMMENT,
      requestPayload
    );
    return response.data;
  },

  getComments: async (
    params: GetCommentsParams
  ): Promise<GetCommentsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("postId", params.postId);
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const response = await httpRequest.get<GetCommentsResponse>(
      `${ApiUrl.GET_COMMENTS}?${queryParams.toString()}`
    );
    return response.data;
  },
};
