"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services";
import { LoginFormData, RegisterFormData } from "@/lib/validations";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { userKeys } from "@/hooks/query/user";

const registerPayload = (data: RegisterFormData) => {
  const { confirmPassword, ...rest } = data;
  return rest;
};

export function useLoginMutation() {
  const { setUser } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: LoginFormData) => authService.login(payload),
    onSuccess: (response) => {
      if (response.status === "success" && response.result?.profile) {
        const user = authService.transformUser(response.result.profile);
        setUser(user);
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Đăng nhập thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Vui lòng kiểm tra lại thông tin đăng nhập",
        variant: "destructive",
      });
    },
  });
}

export function useRegisterMutation() {
  const { setUser } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: RegisterFormData) =>
      authService.register(registerPayload(payload)),
    onSuccess: (response) => {
      if (response.status === "success" && response.result?.profile) {
        const user = authService.transformUser(response.result.profile);
        setUser(user);
        toast({
          title: "Đăng ký thành công",
          description: "Chào mừng bạn đến với AgriNet!",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Vui lòng thử lại sau",
        variant: "destructive",
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { logout } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Clear user state
      logout();
      // Redirect to home
      router.push("/");
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      });
    },
    onError: (error: any) => {
      // Even if logout fails, clear local state
      queryClient.clear();
      logout();
      router.push("/");
      toast({
        title: "Đăng xuất",
        description: "Đã đăng xuất khỏi hệ thống",
      });
    },
  });
}
