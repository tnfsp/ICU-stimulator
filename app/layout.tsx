import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ICU Simulator",
  description: "Pixel ICU decision simulator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
