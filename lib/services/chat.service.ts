import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";
import { ApiResponse } from "@/types/user";

export interface CreateMessagePayload {
  message: string;
  session_id?: string;
}

export interface CreateMessageResponse {
  response: string | object; // API có thể trả về string hoặc object
  session_id: string;
}

export const chatService = {
  createMessage: async (
    payload: CreateMessagePayload
  ): Promise<CreateMessageResponse> => {
    const response = await httpRequest.post<ApiResponse<CreateMessageResponse>>(
      ApiUrl.CREATE_MESSAGE,
      payload
    );

    return response.data.result;
  },
};
