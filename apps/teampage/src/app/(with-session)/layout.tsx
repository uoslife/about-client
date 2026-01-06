import { getServerSession } from 'next-auth';
import { SessionProvider, SessionType } from '@/app/provider/session-provider';
import { authOptions } from '../auth';
import { ClientProvider } from '../provider/client-provider';
import Header from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await getServerSession(authOptions)) as SessionType;

  return (
    <SessionProvider session={session}>
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
