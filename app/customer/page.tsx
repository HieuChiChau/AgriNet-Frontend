"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { postService } from "@/lib/services";
import { Post } from "@/types/post";
import { useToast } from "@/hooks/use-toast";
import { PostList } from "@/components/molecules/post-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/atoms/button";

export default function CustomerDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getPosts({
          page: 1,
          limit: 6,
        });
        if (response.status === "success") {
          setPosts(response.result.data);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách bài đăng",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
            Chào mừng, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và kết nối với nông dân
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-md">
          <Link href="/customer/posts">
            <Icons.search className="mr-2 h-4 w-4" />
            Tìm kiếm sản phẩm
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm có sẵn</CardTitle>
            <Icons.product className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Bài đăng hiện có
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã quan tâm</CardTitle>
            <Icons.arrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm đã lưu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gợi ý</CardTitle>
            <Icons.arrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm phù hợp
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sản phẩm mới nhất</h2>
          <Button variant="outline" asChild>
            <Link href="/customer/posts">Xem tất cả</Link>
          </Button>
        </div>
        <PostList posts={posts} isLoading={isLoading} emptyMessage="Chưa có sản phẩm nào" />
      </div>
    </div>
  );
}

