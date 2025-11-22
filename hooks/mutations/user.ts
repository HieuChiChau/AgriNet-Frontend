"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, UpdateProfilePayload } from "@/lib/services";
import { userKeys } from "@/hooks/query/user";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => authService.updateProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.profile() });

      try {
        const profileResponse = await queryClient.fetchQuery({
          queryKey: userKeys.profile(),
          queryFn: () => authService.getProfile(),
        });
        if (profileResponse.status === "success" && profileResponse.result) {
          const fullUser = authService.transformUser(profileResponse.result);
          setUser(fullUser);
        }
      } catch (error) {
        console.error("Failed to refetch profile:", error);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Vui lòng thử lại sau",
        variant: "destructive",
      });
    },
  });
}

export function useUploadAvatarMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onError: (error: any) => {
      toast({
        title: "Upload ảnh thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể upload ảnh đại diện",
        variant: "destructive",
      });
    },
  });
}
