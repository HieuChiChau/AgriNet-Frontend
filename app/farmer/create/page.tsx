"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/organisms/post-form";
import { CreatePostFormData } from "@/lib/validations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { useUser } from "@/hooks/use-user";

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    data: CreatePostFormData & {
      imageFiles: File[];
      address?: string;
      latitude?: string;
      longitude?: string;
    }
  ) => {
    try {
      setIsLoading(true);

      const imageUrls: string[] = [];
      if (data.imageFiles && data.imageFiles.length > 0) {
        toast({
          title: "Đang upload ảnh...",
          description: `Đang tải lên ${data.imageFiles.length} ảnh`,
        });

        for (const file of data.imageFiles) {
          try {
            const uploadResponse = await postService.uploadPostImage(file);
            if (uploadResponse.status === "success" && uploadResponse.result?.fileUrl) {
              imageUrls.push(uploadResponse.result.fileUrl);
            } else {
              throw new Error("Upload ảnh thất bại");
            }
          } catch (uploadError: any) {
            toast({
              title: "Upload ảnh thất bại",
              description: uploadError?.response?.data?.message || uploadError?.message || "Không thể upload ảnh",
              variant: "destructive",
            });
            return;
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

      const response = await postService.createPost(payload as any);

      if (response.status === "success") {
        toast({
          title: "Thành công",
          description: "Bài đăng đã được tạo thành công!",
        });
        router.push("/farmer/posts");
      } else {
        throw new Error(response.message || "Tạo bài đăng thất bại");
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || error?.message || "Không thể tạo bài đăng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

