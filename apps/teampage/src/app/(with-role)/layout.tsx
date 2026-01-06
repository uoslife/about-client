import { SessionProvider, SessionType } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';
import { BackofficeHeader } from '@/widgets/backoffice-header/BackOfficeHeader';
import { RoleGuard } from './RoleGuard';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await getServerSession(authOptions)) as SessionType;
  return (
    <SessionProvider session={session}>
      <ClientProvider>
        <RoleGuard>
          <div className="min-h-full flex flex-col mx-40 max-md:mx-4">
            <BackofficeHeader />
            <main className="flex-1 w-full flex flex-col items-center">{children}</main>
          </div>
        </RoleGuard>
      </ClientProvider>
    </SessionProvider>
  );
}
