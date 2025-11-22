import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { AuthCTAButtons } from "@/components/molecules/auth-cta-buttons";

export function LandingFinalCTA() {
  return (
    <section className="container py-20">
      <Card className="overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-amber-50 shadow-2xl animate-scale-in animate-delay-300">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6 p-8 animate-fade-in-up animate-delay-400">
            <CardHeader className="space-y-4 p-0 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
                Khởi động nhanh
              </p>
              <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Sẵn sàng kết nối chuỗi cung ứng nông sản thông minh?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tham gia AgriNet ngay để đăng sản phẩm, tìm nguồn hàng và triển khai logistics tối ưu chỉ trong vài phút.
              </CardDescription>
            </CardHeader>
            <AuthCTAButtons variant="cta" />
            <p className="text-sm text-gray-500">
              *Miễn phí cho giai đoạn thử nghiệm. Không yêu cầu thẻ tín dụng.
            </p>
          </div>
          <CardContent className="relative flex items-center justify-center bg-gradient-to-br from-green-100/60 to-yellow-50 animate-slide-in-right animate-delay-500">
            <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-white/50 blur-xl animate-float-slow" />
            <div className="absolute bottom-4 right-6 h-20 w-20 rounded-full bg-amber-200/60 blur-3xl animate-float" />
            <Image
              src="/assets/images/landing-cta-illustration.svg"
              alt="AgriNet call to action"
              width={360}
              height={260}
              className="relative z-10 w-full max-w-[320px] animate-float-slow"
            />
          </CardContent>
        </div>
      </Card>
    </section>
  );
}

