import { useCallback, useRef } from "react";

interface DebouncedApiOptions {
  delay?: number;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

interface ApiRequest {
  url: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  headers?: Record<string, string>;
}

export const useDebouncedApi = (options: DebouncedApiOptions = {}) => {
  const {
    delay = 500,
    baseUrl = "",
    defaultHeaders = { "Content-Type": "application/json" },
  } = options;

  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const makeRequest = useCallback(
    async (request: ApiRequest, requestId?: string) => {
      const id = requestId || `${request.method}-${request.url}`;

      // 이전 요청 취소
      if (abortControllers.current.has(id)) {
        abortControllers.current.get(id)?.abort();
      }

      // 새로운 AbortController 생성
      const abortController = new AbortController();
      abortControllers.current.set(id, abortController);

      try {
        const response = await fetch(`${baseUrl}${request.url}`, {
          method: request.method,
          headers: { ...defaultHeaders, ...request.headers },
          body: request.data ? JSON.stringify(request.data) : undefined,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          throw error;
        }
      } finally {
        abortControllers.current.delete(id);
      }
    },
    [baseUrl, defaultHeaders],
  );

  const debouncedRequest = useCallback(
    (request: ApiRequest, requestId?: string) => {
      const id = requestId || `${request.method}-${request.url}`;

      // 이전 타이머 클리어
      if (timeouts.current.has(id)) {
        clearTimeout(timeouts.current.get(id)!);
      }

      // 새로운 타이머 설정
      const timeout = setTimeout(() => {
        makeRequest(request, id);
        timeouts.current.delete(id);
      }, delay);

      timeouts.current.set(id, timeout);
    },
    [makeRequest, delay],
  );

  // HTTP 메서드별 함수들
  const api = {
    post: (
      url: string,
      data?: any,
      headers?: Record<string, string>,
      requestId?: string,
    ) => {
      debouncedRequest({ url, method: "POST", data, headers }, requestId);
    },

    put: (
      url: string,
      data?: any,
      headers?: Record<string, string>,
      requestId?: string,
    ) => {
      debouncedRequest({ url, method: "PUT", data, headers }, requestId);
    },

    patch: (
      url: string,
      data?: any,
      headers?: Record<string, string>,
      requestId?: string,
    ) => {
      debouncedRequest({ url, method: "PATCH", data, headers }, requestId);
    },

    delete: (
      url: string,
      headers?: Record<string, string>,
      requestId?: string,
    ) => {
      debouncedRequest({ url, method: "DELETE", headers }, requestId);
    },

    // 즉시 실행 (디바운스 없이)
    execute: (request: ApiRequest, requestId?: string) => {
      return makeRequest(request, requestId);
    },

    // 특정 요청 취소
    cancel: (requestId: string) => {
      if (timeouts.current.has(requestId)) {
        clearTimeout(timeouts.current.get(requestId)!);
        timeouts.current.delete(requestId);
      }
      if (abortControllers.current.has(requestId)) {
        abortControllers.current.get(requestId)?.abort();
        abortControllers.current.delete(requestId);
      }
    },

    // 모든 요청 취소
    cancelAll: () => {
      timeouts.current.forEach((timeout) => clearTimeout(timeout));
      timeouts.current.clear();
      abortControllers.current.forEach((controller) => controller.abort());
      abortControllers.current.clear();
    },
  };

  return api;
};

export default useDebouncedApi;
