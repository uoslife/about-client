"use client";

import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type SessionTestType = {
  accessToken: string;
  refreshToken: string;
} & Session;

/**
 * 세션 테스트를 위한 임시 컴포넌트
 */
export const SessionTest = () => {
  const [safeSession, setSafeSession] = useState<SessionTestType | null>(null);
  const { data: session, status } = useSession();

  const safeParseSession = (session: Session): session is SessionTestType => {
    if ("accessToken" in session && "refreshToken" in session) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (session && safeParseSession(session)) {
      setSafeSession(session);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">세션 상태 테스트</h2>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">세션 상태 테스트</h2>
        <p className="mb-4">로그인되지 않았습니다.</p>
        <button
          onClick={() => signIn("keycloak")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Keycloak으로 로그인
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">세션 상태 테스트</h2>
      <div className="space-y-2">
        <p>
          <strong>상태:</strong> {status}
        </p>
        <p>
          <strong>사용자 이름:</strong> {session?.user?.name || "없음"}
        </p>
        <p>
          <strong>이메일:</strong> {session?.user?.email || "없음"}
        </p>
        <p>
          <strong>이미지:</strong> {session?.user?.image || "없음"}
        </p>
        <p>
          <strong>accessToken:</strong> {safeSession?.accessToken}
        </p>
        <p>
          <strong>refreshToken:</strong> {safeSession?.refreshToken}
        </p>
      </div>
      <div className="mt-4">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold">
          전체 세션 데이터 (개발용)
        </summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  );
};
