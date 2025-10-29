// 한글 초성 추출 함수
const getChosung = (str: string): string => {
  const CHOSUNG_LIST = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      // 한글인 경우
      result += CHOSUNG_LIST[Math.floor(code / 588)];
    } else {
      // 한글이 아닌 경우 그대로
      result += str.charAt(i);
    }
  }

  return result;
};

// 초성 검색 여부 확인
const isChosungSearch = (query: string): boolean => {
  const chosungPattern = /^[ㄱ-ㅎ]+$/;
  return chosungPattern.test(query);
};

export { getChosung, isChosungSearch };
