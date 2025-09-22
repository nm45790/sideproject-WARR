"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../components/MainContainer";
import Icons from "../components/Icons";
import { authService } from "../utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!id.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login({
        memberId: id.trim(),
        password: password,
      });

      if (result.success) {
        // 로그인 성공 - 메인 페이지로 이동
        if (result.data?.data.role === "USER") {
          router.push("/guardian");
        } else if (result.data?.data.role === "ACADEMY") {
          router.push("/academy");
        }
      } else {
        setError(result.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <MainContainer>
      {/* Close 버튼 영역 */}
      <div className="flex items-start pt-[45px] pb-[20px]">
        <button
          onClick={handleGoBack}
          className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
        >
          <Icons.Close className="w-[17px] h-[17px] text-[#363e4a]" />
        </button>
      </div>

      {/* 제목 영역 */}
      <div className="pt-[82px] pb-[92px]">
        <h1 className="text-[25px] font-bold text-[#363e4a] leading-[30px] text-center">
          로그인을 해주세요!
        </h1>
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 첫 번째 입력 필드 */}
        <div className="mb-[16px]">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onFocus={() => setIsIdFocused(true)}
            onBlur={() => setIsIdFocused(false)}
            placeholder="아이디를 입력해주세요"
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isIdFocused || id ? "border-[#3f55ff]" : "border-[#d2d2d2]"
            } placeholder:text-[#d2d2d2] placeholder:font-medium`}
          />
        </div>

        {/* 두 번째 입력 필드 */}
        <div className="mb-[25px]">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="비밀번호를 입력해주세요"
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isPasswordFocused || password
                ? "border-[#3f55ff]"
                : "border-[#d2d2d2]"
            } placeholder:text-[#d2d2d2] placeholder:font-medium`}
          />
        </div>

        {/* 입력 필드 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* 첫 번째 입력 필드 */}
          <div className="mb-[16px]">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onFocus={() => setIsIdFocused(true)}
              onBlur={() => setIsIdFocused(false)}
              placeholder="아이디를 입력해주세요"
              className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
                isIdFocused || id ? "border-[#3f55ff]" : "border-[#d2d2d2]"
              } placeholder:text-[#d2d2d2] placeholder:font-medium`}
            />
          </div>

          {/* 두 번째 입력 필드 */}
          <div className="mb-[25px]">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder="비밀번호를 입력해주세요"
              className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
                isPasswordFocused || password
                  ? "border-[#3f55ff]"
                  : "border-[#d2d2d2]"
              } placeholder:text-[#d2d2d2] placeholder:font-medium`}
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !id.trim() || !password.trim()}
            className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors mb-[25px] ${
              isLoading || !id.trim() || !password.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#3f55ff] hover:bg-[#3646e6] cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="font-semibold text-white text-[16px]">
                  로그인 중...
                </span>
              </div>
            ) : (
              <span className="font-semibold text-white text-[16px]">
                로그인
              </span>
            )}
          </button>
        </div>
      </div>
    </MainContainer>
  );
}
