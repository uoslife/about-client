'use client';
import { useUser } from '@/entities/api/useUser';
import { useAuth } from '@/entities/auth/useAuth';
import { Text } from '@/shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export function BackofficeHeader() {
  const { role } = useUser();
  const { session, signOut } = useAuth();

  const hasAccess = role === 'ADMIN' || role === 'FULL_MEMBER';

  return (
    <header className="w-full h-[64px] sticky z-50 py-10 my-10 max-md:my-4 max-md:py-4 bg-white">
      <div className="flex flex-row items-center justify-between">
        {/* 로고 + 타이틀 */}
        <Link href="/" className="flex flex-row items-center gap-4">
          <Image
            src="/img/uoslife_logo_white.png"
            alt="uoslife logo"
            width={32}
            height={32}
            className="shadow-md rounded-[4px]"
          />
          <p className="text-title-24-m max-md:text-title-18-m">시대생 Backoffice</p>
        </Link>
        {/* 권한 확인  */}
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <Text variant="body-18-m" color="grey-700" className="max-md:text-body-12-m">
              {session?.user?.name || '시대생'}
            </Text>
            {hasAccess && <Image src="/svg/check_circle.svg" alt="admin" width={20} height={20} />}
            {!hasAccess && <Image src="/svg/error.svg" alt="associate_member" width={20} height={20} />}
          </div>
          <div className="bg-[#8E8E93] h-[20px] w-[1px]" />
          <button type="button" onClick={() => signOut()}>
            <p className="text-body-18-m color-[#8E8E93] max-md:text-body-12-m">로그아웃</p>
          </button>
        </div>
      </div>
    </header>
  );
}
