import { api } from "./api";
import { tokenManager } from "./cookies";

export interface LoginCredentials {
  memberId: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    id: number;
    email: string;
    name: string;
    role: string;
    academyId: number | null;
    academyAdmin: boolean;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

/**
 * 인증 관련 서비스 함수들
 */
export const authService = {
  /**
   * 로그인
   */
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    data?: LoginResponse;
    error?: string;
  }> {
    try {
      const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        credentials,
        { requireAuth: false },
      );

      if (response.success && response.data) {
        // 토큰 저장
        tokenManager.setAccessToken(response.data.data.accessToken);
        tokenManager.setRefreshToken(response.data.data.refreshToken);

        // 사용자 정보 저장
        tokenManager.setUserInfo(response.data.data);

        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || "로그인에 실패했습니다.",
      };
    } catch (error) {
      console.error("로그인 오류:", error);
      return {
        success: false,
        error: "네트워크 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 로그아웃
   */
  logout(): void {
    // 로컬 토큰 삭제
    tokenManager.clearTokens();

    // 로그인 페이지로 리다이렉트
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  /**
   * 토큰 갱신 (수동 호출용)
   */
  async refreshToken(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        return {
          success: false,
          error: "리프레시 토큰이 없습니다.",
        };
      }

      const response = await api.post<RefreshResponse>(
        "/api/v1/auth/refresh",
        { refreshToken },
        { requireAuth: false },
      );

      if (response.success && response.data) {
        // 새로운 토큰 저장
        tokenManager.setAccessToken(response.data.accessToken);

        // 새로운 리프레시 토큰이 있다면 업데이트
        if (response.data.refreshToken) {
          tokenManager.setRefreshToken(response.data.refreshToken);
        }

        return { success: true };
      }

      return {
        success: false,
        error: response.error || "토큰 갱신에 실패했습니다.",
      };
    } catch (error) {
      console.error("토큰 갱신 오류:", error);
      return {
        success: false,
        error: "네트워크 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }> {
    try {
      const response = await api.get("/api/v1/auth/me");

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || "사용자 정보를 가져올 수 없습니다.",
      };
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
      return {
        success: false,
        error: "네트워크 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return tokenManager.hasTokens();
  },

  /**
   * 토큰 유효성 검사 (서버 확인)
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await api.get("/api/v1/auth/validate");
      return response.success;
    } catch (error) {
      console.error("토큰 유효성 검사 실패:", error);
      return false;
    }
  },

  /**
   * 현재 사용자 정보 조회 (쿠키에서)
   */
  getCurrentUserInfo(): LoginResponse["data"] | null {
    return tokenManager.getUserInfo();
  },

  /**
   * 사용자 정보 업데이트
   */
  updateUserInfo(userInfo: Partial<LoginResponse["data"]>): void {
    const currentUserInfo = tokenManager.getUserInfo();
    if (currentUserInfo) {
      const updatedUserInfo = { ...currentUserInfo, ...userInfo };
      tokenManager.setUserInfo(updatedUserInfo);
    }
  },

  /**
   * 사용자 역할 확인
   */
  getUserRole(): string | null {
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.role || null;
  },

  /**
   * 사용자 ID 조회
   */
  getUserId(): number | null {
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.id || null;
  },
};
