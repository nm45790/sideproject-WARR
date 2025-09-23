import React, { useState } from "react";
import useDebouncedApi from "../utils/debouncedApi";

// 사용 예시 컴포넌트
const DebouncedApiExample = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 디바운스 API 훅 사용
  const api = useDebouncedApi({
    delay: 500, // 500ms 디바운스
    baseUrl: "https://api.example.com",
    defaultHeaders: {
      Authorization: "Bearer your-token",
    },
  });

  // POST 요청 예시
  const handleCreateUser = () => {
    setLoading(true);
    setError(null);

    api.post(
      "/users",
      {
        name: "홍길동",
        email: "hong@example.com",
      },
      undefined,
      "create-user",
    );
  };

  // PUT 요청 예시 (업데이트)
  const handleUpdateUser = (userId: string) => {
    setLoading(true);
    setError(null);

    api.put(
      `/users/${userId}`,
      {
        name: "김철수",
        email: "kim@example.com",
      },
      undefined,
      `update-user-${userId}`,
    );
  };

  // PATCH 요청 예시 (부분 업데이트)
  const handlePartialUpdate = (userId: string) => {
    setLoading(true);
    setError(null);

    api.patch(
      `/users/${userId}`,
      {
        email: "newemail@example.com",
      },
      undefined,
      `patch-user-${userId}`,
    );
  };

  // DELETE 요청 예시
  const handleDeleteUser = (userId: string) => {
    setLoading(true);
    setError(null);

    api.delete(`/users/${userId}`, undefined, `delete-user-${userId}`);
  };

  // 즉시 실행 예시 (디바운스 없이)
  const handleImmediateRequest = async () => {
    try {
      setLoading(true);
      const result = await api.execute({
        url: "/users",
        method: "POST",
        data: { name: "즉시 실행" },
      });
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
    }
  };

  // 특정 요청 취소
  const handleCancelRequest = (requestId: string) => {
    api.cancel(requestId);
  };

  // 모든 요청 취소
  const handleCancelAll = () => {
    api.cancelAll();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">디바운스 API 예시</h2>

      <div className="space-y-2 mb-4">
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          사용자 생성 (POST)
        </button>

        <button
          onClick={() => handleUpdateUser("123")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          사용자 수정 (PUT)
        </button>

        <button
          onClick={() => handlePartialUpdate("123")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          부분 수정 (PATCH)
        </button>

        <button
          onClick={() => handleDeleteUser("123")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          사용자 삭제 (DELETE)
        </button>

        <button
          onClick={handleImmediateRequest}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          즉시 실행
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleCancelRequest("create-user")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          생성 요청 취소
        </button>

        <button
          onClick={handleCancelAll}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          모든 요청 취소
        </button>
      </div>

      {loading && <p className="text-blue-500">로딩 중...</p>}
      {error && <p className="text-red-500">에러: {error}</p>}
      {result && (
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebouncedApiExample;
