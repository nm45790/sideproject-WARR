"use client";
import { useEffect, useState } from "react";
import MainContainer from "./components/MainContainer";
import Splash from "./components/Splash";

export default function Home() {
  const [splashFading, setSplashFading] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setSplashFading(true);
    }, 900);

    const mainTimer = setTimeout(() => {
      setMainVisible(true);
    }, 1000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  return (
    <div className="relative">
      {/* 메인 콘텐츠 */}
      <div
        className={`transition-all duration-700 ease-out ${
          mainVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <MainContainer visibleHeader={false}>
          <div className="bg-white relative w-full min-h-dvh px-5 flex flex-col">
            {/* 상단 콘텐츠 영역 */}
            <div className="pt-[108px] flex-1">
              {/* 메인 타이틀 */}
              <div className="relative">
                <h1 className="font-bold leading-normal text-[#363e4a] text-[20px]">
                  <span className="relative">
                    반려견 케어스페이스
                    {/* 노란색 하이라이트 */}
                    <div className="absolute bg-[#f4ff5d] h-[13px] w-[120px] -bottom-1 right-0 opacity-50" />
                  </span>
                  <br />
                  예약·관리 플랫폼
                </h1>
              </div>

              {/* 서브 타이틀 */}
              <p className="font-medium text-[#858585] text-[13px] mt-[50px]">
                유치원, 호텔, 놀이방 등 다양한 공간을 한 곳에서 간편하게
              </p>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="pb-8 space-y-4">
              {/* 왈 아이디로 로그인 버튼 */}
              <button className="w-full bg-[#3f55ff] h-[59px] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[#3646e6] transition-colors">
                <span className="font-semibold text-white text-[16px]">
                  왈 아이디로 로그인
                </span>
              </button>

              {/* 왈 아이디로 회원가입 버튼 */}
              <div className="flex items-center justify-center py-3">
                <button className="relative cursor-pointer">
                  <span className="font-semibold text-[#363e4a] text-[16px] hover:text-[#2a3238] transition-colors relative">
                    왈 아이디로 회원가입
                    <div className="absolute border-[#363e4a] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 right-0" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </MainContainer>
      </div>

      {/* 스플래시 오버레이 */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ease-out ${
          splashFading ? "opacity-0" : "opacity-100"
        }`}
        style={{ pointerEvents: splashFading ? "none" : "auto" }}
      >
        <Splash />
      </div>
    </div>
  );
}
