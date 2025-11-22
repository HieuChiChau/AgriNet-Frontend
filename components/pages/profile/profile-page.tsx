"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/atoms/card";
import { ProfileForm } from "@/components/organisms/profile/profile-form";
import { useUser } from "@/hooks/use-user";
import { Icons } from "@/components/icons";

export function ProfilePage() {
  const { user, isLoggedIn } = useUser();

  if (!user || !isLoggedIn) {
    return (
      <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50 min-h-screen">
        <div className="container py-16">
          <Card className="mx-auto max-w-xl border-dashed border-2 border-green-200 bg-gradient-to-br from-green-50 to-white text-center shadow-none">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Icons.user className="h-6 w-6 text-green-700" />
              </div>
              <CardTitle>Cần đăng nhập</CardTitle>
              <CardDescription>
                Vui lòng đăng nhập để chỉnh sửa thông tin hồ sơ của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Link href="/login?redirect=/profile">Đăng nhập</Link>
              </Button>
              <Button asChild variant="outline" className="border-green-200 text-green-700">
                <Link href="/signup">Đăng ký tài khoản</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50">
      <div className="container max-w-5xl py-12 space-y-10 ">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-green-600">
            Hồ sơ người dùng
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600">
            Quản lý thông tin liên hệ, khu vực hoạt động và giới thiệu của bạn.
          </p>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

