import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { MainContentLayout } from "@/components/layout/main-content-layout";

const cairoFont = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "مدير التراخيص",
  description: "واجهة أمامية لإدارة التراخيص",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairoFont.variable} antialiased flex flex-col min-h-screen`}>
        <MainContentLayout>
          {children}
        </MainContentLayout>
      </body>
    </html>
  );
}
