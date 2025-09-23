"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../../components/MainContainer";
import Icons from "../../components/Icons";
import { useSignupStore } from "../../store/signupStore";
import useDebouncedApi from "../../utils/debouncedApi";

export default function AccountPage() {
  const router = useRouter();
  const {
    signupData,
    updateMemberId,
    updateMemberPassword,
    isSignupDataComplete,
  } = useSignupStore();

  const [id, setId] = useState(signupData.memberId || "");
  const [password, setPassword] = useState(signupData.memberPassword || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 디바운스 API 훅 사용
  const api = useDebouncedApi();

  // localStorage에서 저장된 값으로 초기값 설정
  useEffect(() => {
    setId(signupData.memberId || "");
    setPassword(signupData.memberPassword || "");
  }, [signupData]);

  const handleGoBack = () => {
    router.back();
  };

  const handleIdChange = (value: string) => {
    // 영문자와 숫자만 허용
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setId(filteredValue);
    updateMemberId(filteredValue);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    updateMemberPassword(value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordError("");
  };

  const handleNext = async () => {
    // 비밀번호 일치 검증
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isSignupDataComplete()) {
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      await api.execute({
        url: "/api/v1/members/step1",
        method: "POST",
        data: {
          memberId: signupData.memberId,
          memberPassword: signupData.memberPassword,
          memberPhone: signupData.memberPhone,
          memberName: signupData.memberName,
          memberEmail: signupData.memberEmail,
          agreeTerms: signupData.termsSelectOption.service,
          agreePrivacy: signupData.termsSelectOption.privacy,
          agreeMarketing: signupData.termsSelectOption.marketing,
        },
      });

      alert("회원가입이 완료되었습니다!");
      router.push("/signup/role");
    } catch (err) {
      alert(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    id.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

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
        {/* 아이디 입력 */}
        <div className="mb-[24px]">
          <div className="mb-[8px]">
            <span className="text-[14px] font-medium text-[#363e4a]">
              아이디
            </span>
            <span className="text-[14px] font-medium text-[#ff3b30] ml-1">
              *
            </span>
          </div>
          <input
            type="text"
            value={id}
            onChange={(e) => handleIdChange(e.target.value)}
            onFocus={() => setIsIdFocused(true)}
            onBlur={() => setIsIdFocused(false)}
            placeholder="아이디를 입력해주세요"
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isIdFocused || id ? "border-[#3f55ff]" : "border-[#d2d2d2]"
            } placeholder:text-[#d2d2d2] placeholder:font-medium`}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-[24px]">
          <div className="mb-[8px]">
            <span className="text-[14px] font-medium text-[#363e4a]">
              비밀번호
            </span>
            <span className="text-[14px] font-medium text-[#ff3b30] ml-1">
              *
            </span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
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

        {/* 비밀번호 재입력 */}
        <div className="mb-[25px]">
          <div className="mb-[8px]">
            <span className="text-[14px] font-medium text-[#363e4a]">
              비밀번호 재입력
            </span>
            <span className="text-[14px] font-medium text-[#ff3b30] ml-1">
              *
            </span>
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            placeholder="비밀번호를 다시 입력해주세요"
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isConfirmPasswordFocused || confirmPassword
                ? "border-[#3f55ff]"
                : "border-[#d2d2d2]"
            } placeholder:text-[#d2d2d2] placeholder:font-medium`}
          />
          {/* 비밀번호 일치 오류 메시지 */}
          {passwordError && (
            <div className="mt-2">
              <p className="text-red-500 text-sm font-medium">
                {passwordError}
              </p>
            </div>
          )}
        </div>

        {/* 회원가입 완료 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
          className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors ${
            isFormValid && !isLoading
              ? "bg-[#3f55ff] hover:bg-[#3646e6] cursor-pointer"
              : "bg-[#f0f0f0] cursor-not-allowed"
          }`}
        >
          <span className="font-semibold text-[16px] text-white">
            {isLoading ? "가입중..." : "회원가입 완료"}
          </span>
        </button>
      </div>
    </MainContainer>
  );
}
