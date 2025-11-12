"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../../../components/MainContainer";
import Icons from "../../../components/Icons";
import { useSignupStore } from "../../../store/signupStore";
import AcademySelectorModal from "../../../components/AcademySelectorModal";
import RegionSelectorModal from "../../../components/RegionSelectorModal";
import { api } from "../../../utils/api";

export default function ParentAcademyPage() {
  const router = useRouter();
  const { signupData, updatePetAcademyId, updateRegionCode } = useSignupStore();

  const [isAcademyModalOpen, setIsAcademyModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionName, setRegionName] = useState("전국");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시 유치원 데이터 (모달에서도 사용하므로 여기서 정의)
  const academies = [
    { id: 1, name: "멍학당", address: "성남시 중원구 금광로 39 602" },
    {
      id: 2,
      name: "멍스멍스 유치원",
      address: "경상남도 김해시 김밥로 단무지77",
    },
    { id: 3, name: "멍멍이 스쿨", address: "경상남도 통영시 굴길 1234" },
  ];

  // 선택된 유치원 정보
  const selectedAcademy = academies.find(
    (academy) => academy.id === signupData.petAcademyId,
  );

  const handleAcademySelect = (academyId: number) => {
    updatePetAcademyId(academyId);
  };

  const handleRegionSelect = (regionCode: string, name: string) => {
    updateRegionCode(regionCode);
    setRegionName(name);
  };

  const handleNext = async () => {
    if (signupData.petAcademyId === 0) {
      alert("유치원을 선택해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      // 반려동물 등록 API 호출
      const petData: any = {
        name: signupData.petName,
        breed: signupData.petBreed,
        birthday: signupData.petBirthday,
        gender: signupData.petGender,
        academyId: signupData.petAcademyId,
        imageKey: signupData.petImageKey,
      };

      // startDate와 endDate는 선택사항으로 처리 (값이 있을 때만 포함)
      if (signupData.petStartDate) {
        petData.startDate = signupData.petStartDate;
      }
      if (signupData.petEndDate) {
        petData.endDate = signupData.petEndDate;
      }

      console.log("반려동물 등록 데이터:", petData);

      const response = await api.post("/api/v1/pets", petData);

      if (response.success) {
        console.log("반려동물 등록 성공:", response.data);
        // 성공 시 complete 페이지로 이동
        router.push("/signup/parent/complete");
      } else {
        throw new Error(response.error || "반려동물 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("반려동물 등록 실패:", error);
      alert("반려동물 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <MainContainer>
      {/* 헤더 영역 - 뒤로가기 */}
      <div className="flex items-center pt-[45px] pb-[20px]">
        <button
          onClick={handleGoBack}
          className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
        >
          <Icons.Prev className="w-[26px] h-[22px]" />
        </button>
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex-1 flex flex-col pt-[46px]">
        {/* 제목 */}
        <div className="mb-[39px]">
          <h2 className="text-[25px] font-bold text-[#363e4a] leading-[30px] mb-[8px]">
            유치원을 등록해주세요!
          </h2>
          <p className="text-[16px] font-medium text-[#858585] leading-[20px]">
            우리 아이가 다니는 유치원을 등록해주세요
          </p>
        </div>

        {/* 유치원 입력 */}
        <div className="mb-[25px]">
          <button
            onClick={() => setIsAcademyModalOpen(true)}
            className="w-full h-[59px] border-[1.5px] border-[#d2d2d2] rounded-[7px] px-5 flex items-center justify-between"
          >
            <span
              className={`text-[16px] font-medium ${
                selectedAcademy ? "text-[#363e4a]" : "text-[#b4b4b4]"
              }`}
            >
              {selectedAcademy ? selectedAcademy.name : "유치원을 입력해주세요"}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="#b4b4b4"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={signupData.petAcademyId === 0 || isSubmitting}
          className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors ${
            signupData.petAcademyId !== 0 && !isSubmitting
              ? "bg-[#3f55ff] cursor-pointer"
              : "bg-[#f0f0f0] cursor-not-allowed"
          }`}
        >
          <span className="font-semibold text-[16px] text-white">
            {isSubmitting ? "등록 중..." : "다음"}
          </span>
        </button>
      </div>

      {/* 유치원 선택 모달 */}
      <AcademySelectorModal
        isOpen={isAcademyModalOpen}
        onClose={() => setIsAcademyModalOpen(false)}
        selectedAcademyId={signupData.petAcademyId}
        onAcademySelect={handleAcademySelect}
        regionCode={signupData.regionCode}
        regionName={regionName}
        onRegionClick={() => setIsRegionModalOpen(true)}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectorModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={signupData.regionCode}
        onRegionSelect={handleRegionSelect}
      />
    </MainContainer>
  );
}
