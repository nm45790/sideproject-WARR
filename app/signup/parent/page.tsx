"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupStore } from "../../store/signupStore";

export default function ParentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAddingPet, resetPetData, updateParentOnboardingCompleted } =
    useSignupStore();

  useEffect(() => {
    // URL 쿼리 파라미터로 모드 확인
    const mode = searchParams.get("mode");

    if (mode === "add") {
      // 강아지 추가 모드
      setIsAddingPet(true);
      resetPetData(); // 강아지 정보 초기화
      // picture 페이지부터 시작 (info, details 건너뜀)
      router.replace("/signup/parent/picture");
    } else {
      // 새 회원 등록 모드
      setIsAddingPet(false);
      updateParentOnboardingCompleted(true); // 온보딩 시작 표시
      // info 페이지부터 시작
      router.replace("/signup/parent/info");
    }
  }, [
    searchParams,
    setIsAddingPet,
    resetPetData,
    updateParentOnboardingCompleted,
    router,
  ]);

  return <div>Loading...</div>;
}
