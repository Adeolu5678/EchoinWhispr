import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { BottomNav } from "@/components/layout/BottomNav";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TopNav } from "@/components/layout/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VentureDeck | The Future of Venture Capital",
  description: "Where Ambition Meets Opportunity. Connect with visionary entrepreneurs and elite investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ConvexClientProvider>
          <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30 selection:text-primary-foreground">
            <TopNav />
            <Breadcrumbs />
            {children}
            <BottomNav />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
