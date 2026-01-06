import { SessionProvider } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';
import Header from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider session={null}>
      <ClientProvider>
        <div className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1 w-full flex flex-col items-center">{children}</main>
          <Footer />
        </div>
      </ClientProvider>
    </SessionProvider>
  );
}
