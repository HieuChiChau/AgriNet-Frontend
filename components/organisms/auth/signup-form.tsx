"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { useRegisterMutation } from "@/hooks/mutations/use-auth";
import { Button } from "@/components/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { useToast } from "@/hooks/use-toast";
import { setAuthorization } from "@/lib/apis/cache-client";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/constants/role";
import { authService } from "@/lib/services";

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, setIsLoggedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resolveRedirect = (role: UserRole) => {
    switch (role) {
      case UserRole.Farmer:
        return "/farmer";
      case UserRole.Customer:
        return "/customer";
      case UserRole.Admin:
        return "/manage/dashboard";
      default:
        return "/";
    }
  };

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      const response = await registerMutation.mutateAsync(values);

      setAuthorization(response.result.accessToken);

      const user = authService.transformUser(response.result.profile);
      setUser(user);

      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã sẵn sàng!",
      });

      router.push(resolveRedirect(user.role));
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error?.response?.data?.message || error?.message || "Vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nguyễn Văn A"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
          disabled={isSubmitting || registerMutation.isPending}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
  );
}

