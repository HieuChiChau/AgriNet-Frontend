import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";
import { AuthResponse, User, UserProfile, ApiResponse } from "@/types/user";
import { LoginFormData, RegisterFormData } from "@/lib/validations";
import { removeAuthorization } from "@/lib/apis/cache-client";

type RegisterPayload = Omit<RegisterFormData, "confirmPassword">;

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  avatar?: string | null;
}

export interface UploadAvatarResponse {
  status: string;
  message: string;
  result: {
    filename: string;
    fileUrl: string;
  };
}

function transformUserProfile(profile: UserProfile): User {
  return {
    id: profile.id,
    email: profile.email,
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    role: profile.role,
    avatar: profile.avatar,
    phone: profile.phone,
    location: profile.address,
    latitude: profile.latitude,
    longitude: profile.longitude,
    address: profile.address,
    status: profile.status,
  };
}

export type LoginResponse = ApiResponse<AuthResponse>;

export type RegisterResponse = ApiResponse<AuthResponse>;

export type ProfileResponse = ApiResponse<UserProfile>;

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
    data: UpdateProfilePayload
  ): Promise<ProfileResponse> => {
    const response = await httpRequest.patch<ProfileResponse>(
      ApiUrl.UPDATE_PROFILE,
      data
    );
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpRequest.post<UploadAvatarResponse>(
      ApiUrl.AVATAR,
      formData
    );
    return response.data;
  },

  transformUser: transformUserProfile,
};
