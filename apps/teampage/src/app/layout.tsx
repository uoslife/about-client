import type { Metadata } from 'next';
import { Footer } from '@/widgets/footer/Footer';
import Header from '@/widgets/header/Header';
import { ClientProvider } from './provider/client-provider';
import { ServerProvider } from './provider/server-provider';
import { DeviceProvider } from '@/shared/provider/DeviceProvider';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  metadataBase: new URL(metaData.siteUrl),
  title: metaData.title,
  description: metaData.description,
  keywords: metaData.keywords,
  authors: [{ name: metaData.author }],
  creator: metaData.author,
  publisher: metaData.sitename,
  alternates: {
    canonical: metaData.siteUrl,
  },

  openGraph: {
    title: metaData.title,
    description: metaData.description,
    url: metaData.siteUrl,
    siteName: metaData.sitename,
    images: [
      {
        url: metaData.image,
        width: 1200,
        height: 630,
        alt: metaData.title,
      },
    ],
    locale: metaData.locale,
    type: metaData.type,
  },
  twitter: {
    card: 'summary_large_image',
    title: metaData.title,
    description: metaData.description,
    images: [metaData.image],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: metaData.icon,
  },
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
            <DeviceProvider>
              <div className="min-h-full flex flex-col">
                <Header />
                <main className="flex-1 w-full flex flex-col items-center">
                  {children}
                </main>
                <Footer />
              </div>
            </DeviceProvider>
          </ClientProvider>
        </ServerProvider>
      </body>
    </html>
  );
}
