"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cookies } from "../utils/cookies";

const queryClient = new QueryClient();

// UserInfo 타입 정의
interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  academyId: number | null;
  academyAdmin: boolean;
}

// UserContext 생성
const UserContext = createContext<UserInfo | null>(null);

// useAuth hook
export function useAuth() {
  return useContext(UserContext);
}

export default function CombinedProvider({
  children,
  userInfo: initialUserInfo,
}: {
  children: ReactNode;
  userInfo?: UserInfo | null;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    initialUserInfo || null,
  );

  // 클라이언트 측에서 쿠키를 다시 확인
  useEffect(() => {
    const userInfoCookie = cookies.get("user_info");
    if (userInfoCookie) {
      try {
        const parsedUserInfo = JSON.parse(userInfoCookie);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Failed to parse user_info cookie:", error);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
