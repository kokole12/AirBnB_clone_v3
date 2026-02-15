import type { Metadata } from "next";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Management Marketplace",
  description: "A modern property management marketplace UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ClerkLoading>
            <div className="flex h-screen w-full items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-sm font-medium text-slate-500">Loading...</p>
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
