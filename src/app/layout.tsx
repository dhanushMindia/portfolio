import type { Metadata } from "next";
import { Inter, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollPhysics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dhanush | Research & Work",
  description: "Personal research portfolio and operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If the path starts with /admin, we might want to hide the public Header/Footer,
  // but this is a RootLayout. So the app/admin/layout.tsx encapsulates admin UI.
  // Next.js App router handles this by rendering admin/layout nested inside RootLayout by default,
  // which might result in double headers. Let's let Header component hide itself in /admin,
  // or just render it cleanly. For now we will render Header and Footer.

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ScrollProgressBar />
        <Header />

        <main className="flex-grow w-full pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
