"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/organisms/post-form";
import { CreatePostFormData } from "@/lib/validations";
import { CreatePostData } from "@/types/post";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePostFormData) => {
    try {
      setIsLoading(true);
      const payload = data as CreatePostData;
      const response = await postService.createPost(payload);

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

