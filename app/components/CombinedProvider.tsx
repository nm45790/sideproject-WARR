"use client";

import { ReactNode, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
  userInfo,
}: {
  children: ReactNode;
  userInfo?: UserInfo | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userInfo || null}>
        {children}
      </UserContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
