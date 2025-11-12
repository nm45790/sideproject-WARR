"use client";

import { useState } from "react";
import Icons from "./Icons";

interface Academy {
  id: number;
  name: string;
  address: string;
}

interface AcademySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAcademyId: number;
  onAcademySelect: (academyId: number) => void;
  regionCode: string;
  regionName: string;
  onRegionClick: () => void;
}

// TODO: 유치원 데이터 받아오기
export default function AcademySelectorModal({
  isOpen,
  onClose,
  selectedAcademyId,
  onAcademySelect,
  regionCode,
  regionName,
  onRegionClick,
}: AcademySelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 임시 유치원 데이터
  const academies: Academy[] = [
    { id: 1, name: "멍학당", address: "성남시 중원구 금광로 39 602" },
    {
      id: 2,
      name: "멍스멍스 유치원",
      address: "경상남도 김해시 김밥로 단무지77",
    },
    { id: 3, name: "멍멍이 스쿨", address: "경상남도 통영시 굴길 1234" },
  ];

  const filteredAcademies = academies.filter((academy) =>
    academy.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAcademyClick = (academyId: number) => {
    onAcademySelect(academyId);
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 영역 */}
      <div className="bg-white">
        {/* 뒤로가기 버튼 */}
        <div className="pt-[73px] px-5">
          <button
            onClick={onClose}
            className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
          >
            <Icons.Prev className="w-[26px] h-[22px]" />
          </button>
        </div>

        {/* 검색 입력 및 지역 선택 */}
        <div className="px-5 mt-[7px] mb-[28px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="유치원을 입력해주세요"
              className="w-full h-[59px] border border-[#d2d2d2] rounded-[7px] px-5 pr-12 text-[16px] font-medium outline-none placeholder:text-[#b4b4b4]"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#b4b4b4]"
              >
                <path
                  d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                  stroke="currentColor"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 지역 선택 버튼 */}
          <div className="flex justify-end mt-[16px]">
            <button
              onClick={onRegionClick}
              className="flex items-center gap-[8px] px-[12px] h-[36px] bg-[rgba(63,85,255,0.1)] border border-[#3f55ff] rounded-[5px]"
            >
              <span className="text-[14px] font-semibold text-[#3f55ff]">
                {regionName}
              </span>
              <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                <path
                  d="M1 1L4.5 4L8 1"
                  stroke="#3f55ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 유치원 리스트 */}
      <div
        className="px-5 overflow-y-auto"
        style={{ height: "calc(100vh - 330px)" }}
      >
        <div className="bg-white">
          {filteredAcademies.length > 0 ? (
            filteredAcademies.map((academy) => (
              <button
                key={academy.id}
                onClick={() => handleAcademyClick(academy.id)}
                className="w-full flex flex-col gap-[7px] px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <p
                  className={`text-[16px] font-bold ${
                    academy.id === selectedAcademyId
                      ? "text-[#3f55ff]"
                      : "text-[#363e4a]"
                  }`}
                >
                  {academy.name}
                </p>
                <p className="text-[12px] font-medium text-[#727272]">
                  {academy.address}
                </p>
              </button>
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-[16px] text-[#8e8e8e]">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
