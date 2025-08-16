import type { Metadata } from "next";
import { AppProvider } from "./provider/app-provider";
import { StyleProvider } from "./provider/style-provider";

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
        <AppProvider>
          <StyleProvider>{children}</StyleProvider>
        </AppProvider>
      </body>
    </html>
  );
}
