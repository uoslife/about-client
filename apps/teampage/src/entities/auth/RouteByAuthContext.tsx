'use client';
import { createContext, useEffect } from 'react';
import { useUser } from '../api/useUser';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { MyInfoResponseRole } from '@uoslife/api';

const RouteByAuthContext = createContext({});

const ROLE_MAP = {
  GUEST: '게스트',
  ASSOCIATE_MEMBER: '준회원',
  FULL_MEMBER: '정회원',
  ADMIN: '관리자',
};

export const RouteByAuthProvider = ({
  children,
  route,
  targetRole,
}: {
  children: React.ReactNode;
  route: string;
  targetRole: MyInfoResponseRole[];
}) => {
  const { open } = useConfirmModal();
  if (!RouteByAuthContext) {
    throw new Error(
      'RouteByAuthContext must be used within a RouteByAuthProvider',
    );
  }
  const { role } = useUser();
  useEffect(() => {
    if (targetRole.includes(role as MyInfoResponseRole)) {
      return;
    }
    open({
      title: '접근 권한이 없습니다.',
      description: `${targetRole.map((role) => ROLE_MAP[role]).join(', ')}만 접근할 수 있습니다.`,
      confirmText: '확인',
      variant: 'default',
      useCancel: false,
      onConfirm: () => {
        window.location.href = route;
      },
    });
  }, [role, open, route, targetRole]);
  return (
    <RouteByAuthContext.Provider value={{}}>
      {children}
    </RouteByAuthContext.Provider>
  );
};
