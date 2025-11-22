import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/atoms/toaster";
import AuthWrapper from "@/components/pages/AuthWrapper";
import ReactQueryProvider from "@/components/providers/use-query";
import { SiteHeader } from "@/components/organisms/common/site-header";
import { SiteFooter } from "@/components/organisms/common/site-footer";
import { ChatBox } from "@/components/organisms/common/chat-box";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AgriNet-Kết nối Nông sản Việt",
  description: "AgriNet-Kết nối Nông sản Việt",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          plusJakartaSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthWrapper>
              <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <ChatBox />
              <Toaster />
            </AuthWrapper>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
