import Image from "next/image";

const statItems = [
  { label: "Giảm chi phí vận chuyển", value: "30%", detail: "Khi ghép đơn & tối ưu tuyến" },
  { label: "Độ chính xác dự báo", value: "92%", detail: "Dựa trên dữ liệu thị trường & thời tiết" },
  { label: "Kết nối trực tiếp", value: "100%", detail: "Nông dân - thương lái - logistics" },
];

export function LandingStats() {
  return (
    <section className="overflow-hidden border-t border-green-100 bg-gradient-to-br from-green-50 to-yellow-50 py-20">
      <div className="container grid gap-12 lg:grid-cols-[1fr,0.9fr]">
        <div className="space-y-6 animate-fade-in-up animate-delay-100">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">Số liệu thực nghiệm</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Bằng chứng cho thấy AgriNet mang lại giá trị thực
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {statItems.map((item, index) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow animate-scale-in transition-transform hover:scale-105"
                style={{
                  animationDelay: `${0.2 + index * 0.15}s`,
                  opacity: 0,
                }}
              >
                <div className="text-4xl font-bold text-green-600">{item.value}</div>
                <p className="mt-1 text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-slide-in-right animate-delay-400">
          <div className="absolute -top-8 right-4 h-32 w-32 rounded-full bg-white/60 blur-2xl animate-float-slow" />
          <div className="absolute -bottom-10 left-0 h-24 w-24 rounded-full bg-green-200/60 blur-3xl animate-float" />
          <div className="relative rounded-[32px] border border-white/80 bg-white/80 p-4 shadow-2xl animate-float-slow">
            <Image
              src="/assets/images/landing-stats-illustration.svg"
              alt="Thống kê AgriNet"
              width={420}
              height={320}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

