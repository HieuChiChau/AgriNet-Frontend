import Image from "next/image";
import { AuthCTAButtons } from "@/components/molecules/auth-cta-buttons";

export function LandingHero() {
  return (
    <section className="container relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/40 via-transparent to-yellow-100/60 blur-3xl animate-fade-in" />
      <div className="relative grid gap-12 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-green-700 shadow animate-fade-in-up animate-delay-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Nền tảng kết nối nông sản Việt Nam
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl animate-fade-in-up animate-delay-200">
              <span className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                AgriNet
              </span>{" "}
              đưa nông sản Việt ra thế giới
            </h1>
            <p className="text-lg text-gray-600 sm:text-xl animate-fade-in-up animate-delay-300">
              Giải bài toán &quot;được mùa mất giá&quot; bằng nền tảng kết nối thông minh.
              Dùng AI dự báo thị trường, đề xuất kết nối tối ưu giữa nông dân, thương lái
              và logistics.
            </p>
          </div>
          <div className="flex justify-center lg:justify-start animate-fade-in-up animate-delay-400">
            <AuthCTAButtons variant="hero" />
          </div>
          <div className="grid gap-6 rounded-3xl border border-green-100 bg-white/80 p-6 shadow-lg sm:grid-cols-2 animate-scale-in animate-delay-500">
            <div>
              <p className="text-3xl font-bold text-green-700">+2,5K</p>
              <p className="text-sm text-gray-500">Tấn nông sản giao dịch thử nghiệm</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">30%</p>
              <p className="text-sm text-gray-500">Chi phí logistics giảm trung bình</p>
            </div>
          </div>
        </div>

        <div className="relative animate-slide-in-right animate-delay-300">
          <div className="absolute -top-6 -left-6 h-32 w-32 rounded-3xl bg-gradient-to-br from-green-200 to-yellow-100 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-gradient-to-br from-yellow-200 to-green-100 blur-3xl animate-float" />
          <div className="relative animate-float-slow">
            <Image
              src="/assets/images/landing-hero-illustration.svg"
              alt="AgriNet hero"
              width={560}
              height={420}
              priority
              className="w-full drop-shadow-2xl"
            />
            <div className="absolute -left-6 top-8 rounded-2xl border border-green-100 bg-white/90 px-4 py-3 text-sm shadow-lg animate-float animate-delay-200">
              <p className="text-xs uppercase tracking-wide text-green-600">Giao dịch hôm nay</p>
              <p className="text-xl font-semibold text-gray-900">52 đơn hàng</p>
            </div>
            <div className="absolute -right-4 bottom-6 rounded-2xl border border-amber-100 bg-white/90 px-4 py-3 text-sm shadow-lg animate-float animate-delay-400">
              <p className="text-xs uppercase tracking-wide text-amber-600">Dự báo AI</p>
              <p className="text-xl font-semibold text-gray-900">+12% nhu cầu rau củ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

