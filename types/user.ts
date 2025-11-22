import { UserRole } from "@/constants/role";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  role: UserRole;
  status: number;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  location?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  bio?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiredIn: number;
  profile: UserProfile;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  result: T;
}
