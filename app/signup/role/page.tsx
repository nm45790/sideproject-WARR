"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../../components/MainContainer";
import { useSignupStore } from "../../store/signupStore";
import { authService } from "../../utils/auth";

export default function RolePage() {
  const router = useRouter();
  const { signupData } = useSignupStore();

  const userInfo = authService.getCurrentUserInfo();

  // 필수 약관 동의 체크
  useEffect(() => {
    const requiredTerms = [
      signupData.termsSelectOption.service,
      signupData.termsSelectOption.privacy,
      signupData.termsSelectOption.thirdParty,
      signupData.termsSelectOption.payment,
    ];

    // 접근권한 체크(TEMP인 경우만 접근 가능)
    if (!userInfo) {
      alert("잘못된 접근입니다.");
      router.push("/");
    } else {
      if (userInfo.role === "TEMP") {
      } else if (!requiredTerms.every(Boolean)) {
        alert("잘못된 접근입니다.");
        router.push("/signup/terms");
      }
    }
  }, [router, signupData.termsSelectOption, userInfo]);

  return (
    <MainContainer>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-[25px] font-bold text-[#363e4a]">
          역할 선택 페이지
        </h1>
      </div>
    </MainContainer>
  );
}
