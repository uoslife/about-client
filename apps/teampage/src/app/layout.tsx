import "@shared/styles/globals.css";
import type { Metadata } from "next";
import { AppProvider } from "./provider/app-provider";

export const metadata: Metadata = {
  title: "UOSLIFE",
  description: "UOSLIFE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
