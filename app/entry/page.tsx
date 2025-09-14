"use client";
import MainContainer from "../components/MainContainer";

export default function Entry() {
  return (
    <MainContainer
      headerLeft={<button className="text-sm">뒤로</button>}
      headerCenter={<span className="text-sm font-semibold">WARR</span>}
      headerRight={<button className="text-sm">설정</button>}
    >
      <h1>Hello World</h1>
    </MainContainer>
  );
}
