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
    <html lang="ko">
      <body>
        <ServerProvider>
          <ClientProvider>
            <Header />
            {children}
            <Footer />
          </ClientProvider>
        </ServerProvider>
      </body>
    </html>
  );
}
