import { getServerSession } from 'next-auth';
import { SessionProvider, SessionType } from '@/app/provider/session-provider';
import { authOptions } from '../auth';
import { ClientProvider } from '../provider/client-provider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await getServerSession(authOptions)) as SessionType;

  return (
    <SessionProvider session={session}>
      <ClientProvider>{children}</ClientProvider>
    </SessionProvider>
  );
}
