import '@shared/styles/global.css';
import type { Metadata } from 'next';
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
    canonical: '/',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
