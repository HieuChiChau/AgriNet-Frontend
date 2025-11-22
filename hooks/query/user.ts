"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authService } from "@/lib/services";
import { ProfileResponse } from "@/lib/services/auth.service";

const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

export function useUserProfile(
  options?: Omit<
    UseQueryOptions<ProfileResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export { userKeys };
