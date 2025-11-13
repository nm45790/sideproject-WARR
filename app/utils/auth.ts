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
    memberId: string;
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
  id?: number;
  email?: string;
  name?: string;
  role?: string;
  academyId?: number | null;
  academyAdmin?: boolean;
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

      const response = await api.post<{ code: number; data: RefreshResponse }>(
        "/api/v1/auth/refresh",
        { refreshToken },
        { requireAuth: false },
      );

      if (response.success && response.data) {
        // API 응답 구조: { code: 200, data: { accessToken, refreshToken, ... } }
        const data = response.data.data;

        if (data && data.accessToken) {
          // 새로운 토큰 저장
          tokenManager.setAccessToken(data.accessToken);
          console.log("✅ AccessToken 갱신 성공");

          // 새로운 리프레시 토큰이 있다면 업데이트
          if (data.refreshToken) {
            tokenManager.setRefreshToken(data.refreshToken);
            console.log("✅ RefreshToken 갱신 성공");
          }

          // 사용자 정보가 있으면 저장 (로그인 API와 동일하게 처리)
          if (data.id && data.role) {
            const userInfo = {
              id: data.id,
              email: data.email || "",
              name: data.name || "",
              role: data.role,
              academyId: data.academyId || null,
              academyAdmin: data.academyAdmin || false,
            };
            tokenManager.setUserInfo(userInfo);
            console.log("✅ 사용자 정보 갱신 성공:", userInfo);
          }

          return { success: true };
        }
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

  /**
   * 리프레시 토큰 조회
   */
  getRefreshToken(): string | null {
    return tokenManager.getRefreshToken();
  },

  /**
   * JWT 토큰에서 사용자 정보 추출 (디코딩)
   */
  decodeToken(token: string): any | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      return null;
    }
  },

  /**
   * 액세스 토큰에서 사용자 정보 추출
   */
  getUserInfoFromToken(): { role: string; id: number } | null {
    const accessToken = tokenManager.getAccessToken();
    console.log(
      "🔍 getUserInfoFromToken - accessToken:",
      accessToken ? "존재함" : "없음",
    );

    if (!accessToken) {
      console.log("❌ accessToken이 없습니다");
      return null;
    }

    const decoded = this.decodeToken(accessToken);
    console.log("🔍 디코딩된 토큰:", decoded);

    if (!decoded) {
      console.log("❌ 토큰 디코딩 실패");
      return null;
    }

    const result = {
      role: decoded.role,
      id: parseInt(decoded.sub), // sub에 사용자 ID가 들어있음
    };
    console.log("✅ 토큰에서 추출한 정보:", result);

    return result;
  },
};
