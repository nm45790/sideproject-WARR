"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../../../components/MainContainer";
import Icons from "../../../components/Icons";
import { useSignupStore } from "../../../store/signupStore";
import { authService } from "../../../utils/auth";

export default function AcademyCallPage() {
  const router = useRouter();
  const { signupData, updateAcademyPhone } = useSignupStore();

  const [phone, setPhone] = useState(signupData.academyPhone || "");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const userInfo = authService.getCurrentUserInfo();

  // 접근권한 체크
  useEffect(() => {
    if (!userInfo || userInfo.role !== "ACADEMY") {
      alert("잘못된 접근입니다.");
      router.push("/");
    }
  }, [router, userInfo]);

  // localStorage에서 저장된 값으로 초기값 설정
  useEffect(() => {
    setPhone(signupData.academyPhone || "");
  }, [signupData]);

  const handleGoBack = () => {
    router.back();
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자, 하이픈 추출
    const numbers = value.replace(/\D-/g, "");

    return numbers;
    // // 길이에 따라 하이픈 추가
    // if (numbers.length <= 3) {
    //   return numbers;
    // } else if (numbers.length <= 7) {
    //   return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    // } else {
    //   return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    // }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
    updateAcademyPhone(formatted);
  };

  const handleNext = () => {
    if (!phone?.trim()) {
      alert("대표번호를 입력해주세요.");
      return;
    }

    router.push("/signup/academy/capacity");
  };

  const isFormValid = phone?.trim() !== "";

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
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex-1 flex flex-col pt-[46px]">
        {/* 제목 */}
        <div className="mb-[8px]">
          <h2 className="text-[25px] font-bold text-[#363e4a] leading-[30px] mb-[8px]">
            대표번호를 입력해 주세요!
          </h2>
          <p className="text-[16px] font-medium text-[#858585] leading-[20px]">
            유치원의 대표번호를 입력해 주세요
          </p>
        </div>

        {/* 대표번호 입력 */}
        <div className="mb-[25px] mt-[53px]">
          <div className="mb-[8px]">
            <span className="text-[16px] font-medium text-[#363e4a]">
              대표번호
            </span>
            <span className="text-[16px] font-medium text-[#ff2407] ml-1">
              *
            </span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={() => setIsPhoneFocused(false)}
            placeholder="대표번호를 입력해주세요"
            className={`w-full h-[59px] border-[1.5px] rounded-[7px] px-5 text-[16px] font-medium outline-none transition-colors ${
              isPhoneFocused || phone ? "border-[#3f55ff]" : "border-[#d2d2d2]"
            } placeholder:text-[#b4b4b4] placeholder:font-medium`}
          />
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors ${
            isFormValid
              ? "bg-[#3f55ff] hover:bg-[#3646e6] cursor-pointer"
              : "bg-[#f0f0f0] cursor-not-allowed"
          }`}
        >
          <span className="font-semibold text-[16px] text-white">다음</span>
        </button>
      </div>
    </MainContainer>
  );
}
