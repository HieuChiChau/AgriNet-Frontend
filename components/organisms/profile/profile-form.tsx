"use client";

import { useMemo, useRef, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { authService } from "@/lib/services";
import {
  profileSchema,
  type ProfileFormData,
} from "@/lib/validations/profile";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { UserRole } from "@/constants/role";

interface ProfileFormProps {
  user: User;
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: "Quản trị viên",
  [UserRole.Farmer]: "Nông dân",
  [UserRole.Customer]: "Thương lái",
};

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const { setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
    },
    mode: "onChange",
  });

  const avatarLetter = useMemo(
    () => user.name?.charAt(0)?.toUpperCase() || "A",
    [user.name]
  );
  const avatarValue = form.watch("avatar");
  const roleLabel = roleLabels[user.role as UserRole] ?? "Thành viên";

  const handleSelectAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Ảnh quá lớn",
        description: "Vui lòng chọn ảnh nhỏ hơn 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue("avatar", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    form.setValue("avatar", "", { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    try {
      const response = await authService.updateProfile(user.id, values);
      if (response.status !== "success" || !response.result) {
        throw new Error("Cập nhật thất bại");
      }
      setUser(response.result);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được lưu lại.",
      });
    } catch (error: any) {
      toast({
        title: "Cập nhật thất bại",
        description: error?.message || "Vui lòng thử lại sau",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[320px,1fr]">
      <Card className="border-green-100 shadow-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow">
              {avatarValue ? (
                <AvatarImage src={avatarValue} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-green-100 text-2xl font-semibold text-green-700">
                  {avatarLetter}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-semibold text-green-800">
            {user.name}
          </CardTitle>
          <CardDescription>
            Vai trò: <span className="font-medium">{roleLabel}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-green-200 text-green-700"
              onClick={handleSelectAvatar}
            >
              <Icons.media className="mr-2 h-4 w-4" />
              Tải ảnh đại diện
            </Button>
            {avatarValue && (
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={handleRemoveAvatar}
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Hỗ trợ PNG, JPG, WEBP (tối đa 2MB). Ảnh sẽ được lưu dạng base64 nếu chưa có CDN.
          </p>
          <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50/60 px-3 py-2">
            <Icons.mail className="h-4 w-4 text-green-600" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Icons.phone className="h-4 w-4 text-green-600" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Icons.mapPin className="h-4 w-4 text-green-600" />
              <span>{user.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-100 shadow-sm">
        <CardHeader>
          <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
          <CardDescription>
            Cập nhật thông tin giúp thương lái và đối tác hiểu bạn hơn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên hiển thị" {...field} />
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
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn ảnh đại diện</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ảnh sẽ tự cập nhật sau khi upload"
                        readOnly
                        className="cursor-not-allowed bg-gray-50 text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Trường này chỉ hiển thị đường dẫn nội bộ, vui lòng sử dụng nút &ldquo;Tải ảnh đại diện&rdquo; để thay đổi.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="+84 912 345 678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khu vực</FormLabel>
                      <FormControl>
                        <Input placeholder="TP. Đà Lạt, Lâm Đồng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới thiệu</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Chia sẻ ngắn gọn về trang trại hoặc nhu cầu của bạn..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-green-200"
                  onClick={() => form.reset()}
                  disabled={form.formState.isSubmitting}
                >
                  Đặt lại
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow"
                  )}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

