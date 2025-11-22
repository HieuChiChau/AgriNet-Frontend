"use client";

import { useUser } from "@/hooks/use-user";
import { PostList } from "@/components/molecules/post-list";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { usePosts } from "@/hooks/query/posts";

export default function FarmerDashboard() {
  const { user } = useUser();
  const { data, isLoading } = usePosts({
    page: 1,
    limit: 6,
  });

  const posts =
    data?.status === "success" ? data.result.data : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Chào mừng, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Quản lý bài đăng và kết nối với thương lái
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md">
          <Link href="/farmer/create">
            <Icons.add className="mr-2 h-4 w-4" />
            Đăng bài mới
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-100 hover:border-green-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng bài đăng</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <Icons.post className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-gray-500">
              Bài đăng của bạn
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100 hover:border-yellow-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Lượt xem</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
              <Icons.media className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <p className="text-xs text-gray-500">
              Tổng lượt xem
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:border-green-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Người quan tâm</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <Icons.user className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-gray-500">
              Thương lái quan tâm
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bài đăng gần đây</h2>
          <Button variant="outline" asChild>
            <Link href="/farmer/posts">Xem tất cả</Link>
          </Button>
        </div>
        <PostList posts={posts} isLoading={isLoading} emptyMessage="Chưa có bài đăng nào" />
      </div>
    </div>
  );
}

