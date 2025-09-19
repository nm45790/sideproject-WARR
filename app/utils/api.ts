import { tokenManager } from "./cookies";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Current baseURL:", this.baseURL);
    if (!this.baseURL) {
      console.warn("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
    }
  }

  /**
   * 토큰 갱신
   */
  private async refreshToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("리프레시 토큰이 없습니다.");
      }

      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("토큰 갱신 실패");
      }

      const data = await response.json();

      if (data.accessToken) {
        tokenManager.setAccessToken(data.accessToken);

        // 새로운 리프레시 토큰이 있다면 업데이트
        if (data.refreshToken) {
          tokenManager.setRefreshToken(data.refreshToken);
        }

        return true;
      }

      throw new Error("새로운 액세스 토큰을 받지 못했습니다.");
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      // 토큰 갱신 실패 시 모든 토큰 삭제
      tokenManager.clearTokens();

      // 로그인 페이지로 리다이렉트
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return false;
    }
  }

  /**
   * HTTP 요청 실행
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { headers = {}, body, requireAuth = true, ...restOptions } = options;

    const url = `${this.baseURL}${endpoint}`;

    // 헤더 설정
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers,
    } as Record<string, string>;

    // 인증이 필요한 경우 토큰 추가
    if (requireAuth) {
      const accessToken = tokenManager.getAccessToken();
      if (accessToken) {
        requestHeaders["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    // 요청 옵션 구성
    const requestOptions: RequestInit = {
      ...restOptions,
      headers: requestHeaders as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // 쿠키 자동 전송 (SSE 호환성)
    };

    try {
      const response = await fetch(url, requestOptions);

      // 401 에러 처리 (토큰 만료)
      if (response.status === 401 && requireAuth) {
        const refreshSuccess = await this.refreshToken();

        if (refreshSuccess) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          const newAccessToken = tokenManager.getAccessToken();
          if (newAccessToken) {
            requestHeaders.Authorization = `Bearer ${newAccessToken}`;
            const retryResponse = await fetch(url, {
              ...requestOptions,
              headers: requestHeaders as HeadersInit,
              credentials: "include", // 쿠키 자동 전송
            });

            return this.parseResponse<T>(retryResponse);
          }
        }

        // 토큰 갱신 실패 시 에러 반환
        return {
          success: false,
          error: "인증이 만료되었습니다. 다시 로그인해주세요.",
          statusCode: 401,
        };
      }

      return this.parseResponse<T>(response);
    } catch (error) {
      console.error("API 요청 실패:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 응답 파싱
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } else {
        return {
          success: false,
          error: data.message || data.error || "서버 오류가 발생했습니다.",
          statusCode: response.status,
        };
      }
    } catch (error) {
      console.error("응답 파싱 중 오류가 발생했습니다:", error);
      return {
        success: false,
        error: "응답 파싱 중 오류가 발생했습니다.",
        statusCode: response.status,
      };
    }
  }

  // HTTP 메서드별 헬퍼 함수들
  async get<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();

// 편의를 위한 단축 함수들
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    apiClient.get<T>(endpoint, options),

  post: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.post<T>(endpoint, body, options),

  put: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.put<T>(endpoint, body, options),

  patch: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.patch<T>(endpoint, body, options),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    apiClient.delete<T>(endpoint, options),
};
