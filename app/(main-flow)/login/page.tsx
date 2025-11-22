"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AuthPageTemplate } from "@/components/templates/auth/auth-page-template";
import { LoginForm } from "@/components/organisms/auth/login-form";

export default function LoginPage() {
  return (
    <AuthPageTemplate
      title="Đăng nhập"
      description="Nhập thông tin tài khoản để tiếp tục hành trình cùng AgriNet."
      badge="Chào mừng trở lại"
      footer={
        <p className="text-sm text-center text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/signup"
            className="text-green-600 hover:text-green-700 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      }
    >
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Đang tải biểu mẫu...</div>}>
        <LoginForm />
      </Suspense>
    </AuthPageTemplate>
  );
}
