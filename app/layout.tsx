import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Learning Dashboard",
  description:
    "A modern student and course management dashboard built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          richColors
          position="top-right"
          closeButton
        />
      </body>
    </html>
  );
}
