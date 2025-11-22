"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/organisms/post/post-form";
import { CreatePostFormData } from "@/lib/validations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { useUser } from "@/hooks/use-user";
import { useUpdatePostMutation, useUploadPostImageMutation } from "@/hooks/mutations/posts";
import { usePost } from "@/hooks/query/posts";
import { Loader2 } from "lucide-react";

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const updatePostMutation = useUpdatePostMutation();
  const uploadImageMutation = useUploadPostImageMutation();
  const { data, isLoading, isError } = usePost(params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-green-700">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (isError || !data || data.status !== "success") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-gray-900">
          Không tìm thấy bài viết
        </p>
        <p className="text-sm text-gray-500">
          Bài viết có thể đã bị xóa hoặc không tồn tại.
        </p>
        <button
          type="button"
          onClick={() => router.push("/farmer/posts")}
          className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const postData = data.result;

  const postAddress = (postData as any).address || postData.user.address || "";
  const postLatitude = (postData as any).latitude || postData.user.latitude || "";
  const postLongitude = (postData as any).longitude || postData.user.longitude || "";

  const defaultValues: Partial<CreatePostFormData> = {
    title: postData.title,
    content: postData.content,
    images: postData.images.map((img) => img.url),
  };

  const handleSubmit = async (
    data: CreatePostFormData & {
      imageFiles: File[];
      address?: string;
      latitude?: string;
      longitude?: string;
    }
  ) => {
    try {
      const imageUrls: string[] = [];

      if (data.imageFiles && data.imageFiles.length > 0) {
        toast({
          title: "Đang upload ảnh...",
          description: `Đang tải lên ${data.imageFiles.length} ảnh`,
        });

        for (const file of data.imageFiles) {
          try {
            const uploadResponse = await uploadImageMutation.mutateAsync(file);
            if (uploadResponse.status === "success" && uploadResponse.result?.fileUrl) {
              imageUrls.push(uploadResponse.result.fileUrl);
            } else {
              throw new Error("Upload ảnh thất bại");
            }
          } catch (uploadError: any) {
            return;
          }
        }
      }

      const existingImages = data.images?.filter((img) =>
        typeof img === "string" && (img.startsWith("http") || img.startsWith("https"))
      ) || [];
      const finalImages = [...existingImages, ...imageUrls];

      let finalAddress: string | null = null;
      let finalLatitude: number | null = null;
      let finalLongitude: number | null = null;

      if (data.latitude && data.latitude.trim()) {
        const parsed = parseFloat(data.latitude.trim());
        if (!isNaN(parsed)) {
          finalLatitude = parsed;
        }
      }
      if (data.longitude && data.longitude.trim()) {
        const parsed = parseFloat(data.longitude.trim());
        if (!isNaN(parsed)) {
          finalLongitude = parsed;
        }
      }

      if (data.address && data.address.trim()) {
        finalAddress = data.address.trim();
      }

      if (!finalAddress && finalLatitude === null && finalLongitude === null) {
        if (user?.address) {
          finalAddress = user.address;
        }
        if (user?.latitude) {
          const parsed = parseFloat(user.latitude);
          if (!isNaN(parsed)) {
            finalLatitude = parsed;
          }
        }
        if (user?.longitude) {
          const parsed = parseFloat(user.longitude);
          if (!isNaN(parsed)) {
            finalLongitude = parsed;
          }
        }
      }

      const payload = {
        title: data.title,
        content: data.content,
        images: finalImages,
        latitude: finalLatitude ?? 0,
        longitude: finalLongitude ?? 0,
        address: finalAddress ?? "",
      };

      await updatePostMutation.mutateAsync({
        id: params.id,
        data: payload as any,
      });

      toast({
        title: "Thành công",
        description: "Bài đăng đã được cập nhật thành công!",
      });
      router.push("/farmer/posts");
    } catch (error: any) {
      if (!error?.response) {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể cập nhật bài đăng",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa bài đăng</h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin bài đăng của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>
            Cập nhật thông tin để bài đăng của bạn được nhiều người quan tâm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm
            onSubmit={handleSubmit}
            isLoading={updatePostMutation.isPending || uploadImageMutation.isPending}
            defaultValues={defaultValues}
            isEditMode={true}
            defaultAddress={postAddress}
            defaultLatitude={postLatitude}
            defaultLongitude={postLongitude}
          />
        </CardContent>
      </Card>
    </div>
  );
}

