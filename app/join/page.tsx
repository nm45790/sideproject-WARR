"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../components/MainContainer";
import Icons from "../components/Icons";

type Agreement = {
  id: string;
  title: string;
  required: boolean;
  checked: boolean;
};

export default function JoinPage() {
  const router = useRouter();

  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: "service",
      title: "(필수) 서비스 이용약관 동의",
      required: true,
      checked: false,
    },
    {
      id: "privacy",
      title: "(필수) 개인정보 수집 및 이용 동의",
      required: true,
      checked: false,
    },
    {
      id: "thirdParty",
      title: "(필수) 개인정보 제3자 제공 동의",
      required: true,
      checked: false,
    },
    {
      id: "payment",
      title: "(필수) 결제 서비스 이용약관",
      required: true,
      checked: false,
    },
    {
      id: "marketing",
      title: "(선택) 광고성 정보 수신 전체 동의",
      required: false,
      checked: false,
    },
  ]);

  const [allAgreed, setAllAgreed] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleAllAgreeToggle = () => {
    const newAllAgreed = !allAgreed;
    setAllAgreed(newAllAgreed);
    setAgreements((prev) =>
      prev.map((agreement) => ({ ...agreement, checked: newAllAgreed })),
    );
  };

  const handleAgreementToggle = (id: string) => {
    setAgreements((prev) => {
      const updated = prev.map((agreement) =>
        agreement.id === id
          ? { ...agreement, checked: !agreement.checked }
          : agreement,
      );

      // 전체 동의 상태 업데이트
      const allChecked = updated.every((agreement) => agreement.checked);
      setAllAgreed(allChecked);

      return updated;
    });
  };

  const handleViewTerms = (id: string) => {
    // TODO: 약관 상세 페이지로 이동
    console.log(`View terms for: ${id}`);
  };

  const requiredAgreements = agreements.filter((a) => a.required);
  const allRequiredChecked = requiredAgreements.every((a) => a.checked);

  const handleJoin = () => {
    if (allRequiredChecked) {
      // TODO: 회원가입 로직
      console.log("회원가입 진행");
    }
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
      <div className="pt-[66px] pb-[50px]">
        <h1 className="text-[25px] font-bold text-[#363e4a] leading-[30px]">
          회원가입
        </h1>
      </div>

      {/* 약관 동의 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 전체 동의 */}
        <div className="mb-6">
          <button onClick={handleAllAgreeToggle} className="flex items-center">
            <Icons.Checkbox checked={allAgreed} className="w-5 h-5 mr-3" />
            <span className="text-[16px] font-bold text-[#8e8e8e]">
              약관 전체 동의
            </span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-[#e5e5e5] mb-4"></div>

        {/* 개별 약관들 */}
        <div className="space-y-[19px] mb-8">
          {agreements.map((agreement, index) => (
            <div
              key={agreement.id}
              className="flex items-center justify-between"
            >
              <button
                onClick={() => handleAgreementToggle(agreement.id)}
                className="flex items-center flex-1"
              >
                <Icons.Checkbox
                  checked={agreement.checked}
                  className="w-5 h-5 mr-[8px]"
                />
                <span className="text-[13px] font-medium text-[#8e8e8e] text-left">
                  {agreement.title}
                </span>
              </button>
              <button
                onClick={() => handleViewTerms(agreement.id)}
                className="text-[12px] font-medium text-[#3f55ff] ml-4"
              >
                보기
              </button>
            </div>
          ))}
        </div>

        {/* 광고성 정보 수신 안내 */}
        <div className="mb-8 pl-[28px]">
          <p className="text-[13px] font-medium text-[#5a5a5a] leading-[18px]">
            광고성 정보 수신에 동의하시면, 이벤트 및 할인 혜택 안내를 누구보다
            빠르게 받아보실 수 있어요!
          </p>
        </div>

        {/* 동의하고 가입하기 버튼 */}
        <button
          onClick={handleJoin}
          disabled={!allRequiredChecked}
          className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors ${
            allRequiredChecked
              ? "bg-[#3f55ff] hover:bg-[#3646e6] cursor-pointer"
              : "bg-[#f0f0f0] cursor-not-allowed"
          }`}
        >
          <span className="font-semibold text-[16px] text-white">
            동의하고 가입하기
          </span>
        </button>
      </div>
    </MainContainer>
  );
}
