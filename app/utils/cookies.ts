/**
 * 쿠키 관리 유틸리티
 */

interface CookieOptions {
  expires?: Date;
  maxAge?: number; // seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const cookies = {
  /**
   * 쿠키 설정
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.httpOnly) {
      cookieString += `; httponly`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * 쿠키 조회
   */
  get(name: string): string | null {
    if (typeof document === "undefined") return null;

    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  },

  /**
   * 쿠키 삭제
   */
  remove(
    name: string,
    options: Omit<CookieOptions, "expires" | "maxAge"> = {},
  ): void {
    this.set(name, "", {
      ...options,
      expires: new Date(0),
    });
  },

  /**
   * 모든 쿠키 조회
   */
  getAll(): Record<string, string> {
    if (typeof document === "undefined") return {};

    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(";");

    for (let cookie of cookieStrings) {
      cookie = cookie.trim();
      const [name, value] = cookie.split("=");
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  },
};

// 토큰 관리 특화 함수들
export const tokenManager = {
  ACCESS_TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",

  /**
   * 액세스 토큰 저장 (쿠키로 저장 - SSE 호환성, JS 읽기 가능)
   */
  setAccessToken(token: string): void {
    cookies.set(this.ACCESS_TOKEN_KEY, token, {
      maxAge: 15 * 60, // 15분
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // SSE + API 헤더 둘 다 사용하기 위해
      sameSite: "lax",
    });
  },

  /**
   * 액세스 토큰 조회
   */
  getAccessToken(): string | null {
    return cookies.get(this.ACCESS_TOKEN_KEY);
  },

  /**
   * 리프레시 토큰 저장 (HttpOnly 쿠키로 저장)
   */
  setRefreshToken(token: string): void {
    cookies.set(this.REFRESH_TOKEN_KEY, token, {
      maxAge: 7 * 24 * 60 * 60, // 7일
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  },

  /**
   * 리프레시 토큰 조회
   */
  getRefreshToken(): string | null {
    return cookies.get(this.REFRESH_TOKEN_KEY);
  },

  /**
   * 모든 토큰 삭제
   */
  clearTokens(): void {
    // 액세스 토큰 삭제 (쿠키)
    cookies.remove(this.ACCESS_TOKEN_KEY, { path: "/" });

    // 리프레시 토큰 삭제 (쿠키)
    cookies.remove(this.REFRESH_TOKEN_KEY, { path: "/" });
  },

  /**
   * 토큰 존재 여부 확인
   */
  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  },
};
