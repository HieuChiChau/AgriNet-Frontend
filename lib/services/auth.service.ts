import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";
import { AuthResponse, User } from "@/types/user";
import {
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
} from "@/lib/validations";
import { removeAuthorization } from "@/lib/apis/cache-client";

type RegisterPayload = Omit<RegisterFormData, "confirmPassword">;

export interface LoginResponse {
  status: string;
  result: AuthResponse;
  message?: string;
}

export interface RegisterResponse {
  status: string;
  result: AuthResponse;
  message?: string;
}

export interface ProfileResponse {
  status: string;
  result: User;
  message?: string;
}

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await httpRequest.post<LoginResponse>(ApiUrl.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await httpRequest.post<RegisterResponse>(
      ApiUrl.REGISTER,
      data
    );
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await httpRequest.get<ProfileResponse>(ApiUrl.GET_PROFILE);
    return response.data;
  },

  logout: async (): Promise<void> => {
    removeAuthorization();
  },

  updateProfile: async (
    userId: string | number,
    data: ProfileFormData
  ): Promise<ProfileResponse> => {
    const response = await httpRequest.put<ProfileResponse>(
      ApiUrl.UPDATE_PROFILE(userId),
      data
    );
    return response.data;
  },
};
