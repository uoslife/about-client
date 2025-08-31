import type { Metadata } from 'next';
import { Footer } from '@/widgets/footer/Footer';
import Header from '@/widgets/header/Header';
import { ClientProvider } from './provider/client-provider';
import { ServerProvider } from './provider/server-provider';

export const metadata: Metadata = {
  title: 'UOSLIFE',
  description: 'UOSLIFE',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full">
        <ServerProvider>
          <ClientProvider>
            <div className="min-h-full flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientProvider>
        </ServerProvider>
      </body>
    </html>
  );
}
