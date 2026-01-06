'use client';
import { useUser } from '@/entities/api/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const router = useRouter();
  const { role } = useUser();

  useEffect(() => {
    if (role === 'GUEST') {
      router.push('/');
    }
  }, [role, router]);

  return <>{children}</>;
}

