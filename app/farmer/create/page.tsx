"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/organisms/post-form";
import { CreatePostFormData } from "@/lib/validations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { useUser } from "@/hooks/use-user";
import { useCreatePostMutation, useUploadPostImageMutation } from "@/hooks/mutations/posts";

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const createPostMutation = useCreatePostMutation();
  const uploadImageMutation = useUploadPostImageMutation();

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
            return; // Error đã được handle trong mutation
          }
        }
      }

      let finalAddress = data.address;
      let finalLatitude = data.latitude ? parseFloat(data.latitude) : null;
      let finalLongitude = data.longitude ? parseFloat(data.longitude) : null;

      if (!finalAddress && user?.address) {
        finalAddress = user.address;
      }
      if (!finalLatitude && user?.latitude) {
        finalLatitude = parseFloat(user.latitude);
      }
      if (!finalLongitude && user?.longitude) {
        finalLongitude = parseFloat(user.longitude);
      }

      const payload = {
        title: data.title,
        content: data.content,
        images: imageUrls,
        latitude: finalLatitude || 0,
        longitude: finalLongitude || 0,
        address: finalAddress || "",
      };

      await createPostMutation.mutateAsync(payload as any);

      toast({
        title: "Thành công",
        description: "Bài đăng đã được tạo thành công!",
      });
      router.push("/farmer/posts");
    } catch (error: any) {
      // Error đã được handle trong mutation
      if (!error?.response) {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể tạo bài đăng",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Đăng bài mới</h1>
        <p className="text-muted-foreground">
          Tạo bài đăng để bán nông sản của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để bài đăng của bạn được nhiều người quan tâm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm
            onSubmit={handleSubmit}
            isLoading={createPostMutation.isPending || uploadImageMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

