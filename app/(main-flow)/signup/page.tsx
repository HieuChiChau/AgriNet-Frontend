"use client";

import Link from "next/link";
import { AuthPageTemplate } from "@/components/templates/auth/auth-page-template";
import { SignupForm } from "@/components/organisms/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthPageTemplate
      title="Đăng ký tài khoản"
      description="Tạo hồ sơ AgriNet để kết nối cộng đồng nông sản Việt."
      badge="Gia nhập cộng đồng"
      footer={
        <p className="text-sm text-center text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-700 hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthPageTemplate>
  );
}

