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
import { authService, UpdateProfilePayload } from "@/lib/services";
import {
  profileSchema,
  type ProfileFormData,
} from "@/lib/validations/profile";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { UserRole } from "@/constants/role";
import { GoogleMapsAutocomplete } from "@/components/molecules/google-maps-autocomplete";

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
  const avatarFileRef = useRef<File | null>(null); // Lưu file gốc để upload

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || user.name?.split(" ")[0] || "",
      lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      email: user.email,
      avatar: user.avatar || "",
      phone: user.phone || "",
      address: user.address || user.location || "",
      latitude: user.latitude || "",
      longitude: user.longitude || "",
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

    // Lưu file gốc để upload sau
    avatarFileRef.current = file;

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue("avatar", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    form.setValue("avatar", "", { shouldDirty: true });
    avatarFileRef.current = null; // Xóa file đã lưu
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    try {
      let avatarUrl: string | null = null;

      // Nếu có file ảnh mới, upload trước
      if (avatarFileRef.current) {
        try {
          const uploadResponse = await authService.uploadAvatar(avatarFileRef.current);
          if (uploadResponse.status === "success" && uploadResponse.result?.fileUrl) {
            avatarUrl = uploadResponse.result.fileUrl;
            console.log("Avatar uploaded:", avatarUrl);
          } else {
            throw new Error("Upload avatar thất bại");
          }
        } catch (uploadError: any) {
          toast({
            title: "Upload ảnh thất bại",
            description: uploadError?.response?.data?.message || uploadError?.message || "Không thể upload ảnh đại diện",
            variant: "destructive",
          });
          throw uploadError;
        }
      }

      const payload: UpdateProfilePayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone || null,
        address: values.address || null,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        // Chỉ gửi avatar nếu có upload ảnh mới
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      const response = await authService.updateProfile(payload);
      if (response.status !== "success" || !response.result) {
        throw new Error("Cập nhật thất bại");
      }

      // Reset file ref sau khi upload thành công
      avatarFileRef.current = null;

      const profileResponse = await authService.getProfile();
      if (profileResponse.status === "success" && profileResponse.result) {
        const fullUser = authService.transformUser(profileResponse.result);
        setUser(fullUser);
      } else {
        const updatedProfile = authService.transformUser(response.result);
        const mergedUser: User = {
          ...user,
          ...updatedProfile,
          avatar: updatedProfile.avatar ?? user.avatar,
          email: updatedProfile.email ?? user.email,
          role: updatedProfile.role ?? user.role,
          status: updatedProfile.status ?? user.status,
        };
        setUser(mergedUser);
      }
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được lưu lại.",
      });
    } catch (error: any) {
      toast({
        title: "Cập nhật thất bại",
        description: error?.response?.data?.message || error?.message || "Vui lòng thử lại sau",
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
          {user.address && (
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <Icons.mapPin className="h-4 w-4 text-green-600" />
              <span>{user.address}</span>
            </div>
          )}
          {user.latitude && user.longitude && (
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2 text-xs">
              <Icons.mapPin className="h-4 w-4 text-green-600" />
              <span>
                Tọa độ: {parseFloat(user.latitude).toFixed(6)},{" "}
                {parseFloat(user.longitude).toFixed(6)}
              </span>
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ</FormLabel>
                      <FormControl>
                        <Input placeholder="Đức Sơn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Huỳnh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        readOnly
                        disabled
                        className="cursor-not-allowed bg-gray-50 text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Email không thể thay đổi sau khi đăng ký
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0895002655" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <GoogleMapsAutocomplete
                        value={field.value || ""}
                        latitude={form.watch("latitude")}
                        longitude={form.watch("longitude")}
                        onSelect={(address, lat, lng) => {
                          field.onChange(address);
                          form.setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
                          form.setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
                        }}
                        onChange={field.onChange}
                        placeholder="Nhập địa chỉ để tự động lấy tọa độ..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ (Latitude)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="16.45160000"
                          readOnly
                          className="cursor-not-allowed bg-gray-50 text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Tự động lấy từ địa chỉ
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh độ (Longitude)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="107.57690000"
                          readOnly
                          className="cursor-not-allowed bg-gray-50 text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Tự động lấy từ địa chỉ
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

