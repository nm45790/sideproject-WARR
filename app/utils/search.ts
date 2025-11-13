/**
 * 한글 초성 검색 유틸리티
 */

// 한글 초성 리스트
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

/**
 * 한글 문자에서 초성 추출
 */
function getChosung(char: string): string {
  const code = char.charCodeAt(0);

  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code >= 0xac00 && code <= 0xd7a3) {
    const chosungIndex = Math.floor((code - 0xac00) / 588);
    return CHOSUNG_LIST[chosungIndex];
  }

  // 초성 자체인 경우
  if (CHOSUNG_LIST.includes(char)) {
    return char;
  }

  // 한글이 아닌 경우 그대로 반환
  return char;
}

/**
 * 문자열의 초성 추출
 */
function extractChosung(text: string): string {
  return text
    .split("")
    .map((char) => getChosung(char))
    .join("");
}

/**
 * 검색어가 초성인지 확인
 */
function isChosungOnly(text: string): boolean {
  return text.split("").every((char) => CHOSUNG_LIST.includes(char));
}

/**
 * 초성 검색 지원 매칭 함수
 * @param text 검색 대상 텍스트
 * @param searchTerm 검색어
 * @returns 매칭 여부
 */
export function matchesSearch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true;
  if (!text) return false;

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();

  // 일반 텍스트 매칭
  if (lowerText.includes(lowerSearchTerm)) {
    return true;
  }

  // 검색어가 초성인 경우에만 초성 매칭 수행
  if (isChosungOnly(searchTerm)) {
    const textChosung = extractChosung(text);
    return textChosung.includes(searchTerm);
  }

  return false;
}

/**
 * 배열에서 초성 검색
 * @param items 검색할 아이템 배열
 * @param searchTerm 검색어
 * @param getSearchText 아이템에서 검색할 텍스트를 추출하는 함수
 * @returns 필터링된 배열
 */
export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  getSearchText: (item: T) => string,
): T[] {
  if (!searchTerm) return items;

  return items.filter((item) => {
    const text = getSearchText(item);
    return matchesSearch(text, searchTerm);
  });
}
