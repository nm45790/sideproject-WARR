"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "../components/MainContainer";
import Icons from "../components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    // 로그인 로직
    console.log("Login attempt:", { id, password });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <MainContainer visibleHeader={false}>
      <div className="bg-white relative w-full min-h-dvh px-5 flex flex-col">
        {/* Close 버튼 영역 - Figma 비율 기준 5.5% */}
        <div className="flex items-start pt-[45px] pb-[20px]">
          <button
            onClick={handleGoBack}
            className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
          >
            <Icons.Close className="w-[17px] h-[17px] text-[#363e4a]" />
          </button>
        </div>

        {/* 제목 영역 - Figma 164px까지의 비율 맞춤 */}
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

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            className="w-full h-[59px] bg-[#3f55ff] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[#3646e6] transition-colors mb-[25px]"
          >
            <span className="font-semibold text-white text-[16px]">로그인</span>
          </button>

          {/* 하단 링크들 */}
          <div className="flex items-center justify-center text-[13px] text-[#b4b4b4] font-medium pb-8">
            <button className="hover:text-[#999] transition-colors">
              아이디 찾기
            </button>
            <div className="w-[2px] h-[2px] bg-[#b4b4b4] rounded-full mx-[9px]"></div>
            <button className="hover:text-[#999] transition-colors">
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
