import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
