"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../../components/MainContainer";
import Icons from "../../components/Icons";
import { useSignupStore } from "../../store/signupStore";
import useDebouncedApi from "../../utils/debouncedApi";

export default function VerifyPage() {
  const router = useRouter();
  const { signupData } = useSignupStore();

  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 디바운스 API 훅 사용
  const api = useDebouncedApi();

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleGoBack = () => {
    router.back();
  };

  const handleCodeChange = (value: string) => {
    // 숫자만 입력 허용 (6자리)
    const numbers = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(numbers);
    setError("");

    // 6자리 입력 시 자동 검증
    if (numbers.length === 6) {
      handleVerifyCode(numbers);
    }
  };

  const handleSendCode = async () => {
    if (!signupData.phone) {
      setError("전화번호가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.execute({
        url: "/api/v1/phone-verification/send-code",
        method: "POST",
        data: { phoneNumber: signupData.phone },
      });

      setSuccess("인증번호가 발송되었습니다.");
      setIsCodeSent(true);
      setTimeLeft(300); // 5분
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "인증번호 발송에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code?: string) => {
    const codeToVerify = code || verificationCode;

    if (!codeToVerify || codeToVerify.length !== 6) {
      setError("6자리 인증번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/phone-verification/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: signupData.phone,
            verificationCode: codeToVerify,
          }),
        },
      );

      if (response.ok) {
        setSuccess("인증이 완료되었습니다!");
        // 인증 완료 후 다음 단계로 이동
        setTimeout(() => {
          router.push("/signup/account");
        }, 1500);
      } else {
        // 200이 아닌 경우 input 초기화 및 alert
        setVerificationCode("");
        alert("인증번호가 올바르지 않습니다. 다시 입력해주세요.");
      }
    } catch (err) {
      setVerificationCode("");
      alert("인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <MainContainer>
      {/* 헤더 영역 - 뒤로가기 + 제목 */}
      <div className="flex items-center pt-[45px] pb-[20px]">
        <button
          onClick={handleGoBack}
          className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
        >
          <Icons.ArrowLeft className="w-[24px] h-[24px] text-[#363e4a]" />
        </button>
        <h1 className="text-[25px] font-bold text-[#363e4a] leading-[30px] ml-4">
          회원가입
        </h1>
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex-1 flex flex-col pt-[46px]">
        {/* 전화번호 표시 */}
        <div className="mb-[24px]">
          <div className="w-full h-[59px] rounded-[7px] px-5 flex items-center justify-center">
            <span className="text-[16px] font-medium text-[#363e4a]">
              {signupData.phone}
            </span>
          </div>
        </div>

        {/* 인증번호 입력 */}
        <div className="mb-[24px]">
          <div className="mb-[8px]">
            <span className="text-[14px] font-medium text-[#363e4a]">
              인증번호
            </span>
            <span className="text-[14px] font-medium text-[#ff3b30] ml-1">
              *
            </span>
          </div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            onFocus={() => setIsCodeFocused(true)}
            onBlur={() => setIsCodeFocused(false)}
            placeholder="인증번호 6자리를 입력해주세요"
            maxLength={6}
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isCodeFocused || verificationCode
                ? "border-[#3f55ff]"
                : "border-[#d2d2d2]"
            } placeholder:text-[#d2d2d2] placeholder:font-medium`}
          />

          {/* 재발송 텍스트 버튼 */}
          <div className="mt-3 text-center">
            <button
              onClick={handleSendCode}
              disabled={isLoading || timeLeft > 0}
              className={`text-[14px] font-medium underline transition-colors ${
                isLoading || timeLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#B4B4B4] cursor-pointer"
              }`}
            >
              {isLoading
                ? "발송중..."
                : timeLeft > 0
                  ? `인증번호 다시 받기 (${formatTime(timeLeft)})`
                  : "인증번호 다시 받기"}
            </button>
          </div>
        </div>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm font-medium">{success}</p>
          </div>
        )}
      </div>
    </MainContainer>
  );
}
