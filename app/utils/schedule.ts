// 요일 데이터
export const daysOfWeek = [
  { key: "MON", label: "월요일", color: "text-[#8e8e8e]" },
  { key: "TUE", label: "화요일", color: "text-[#8e8e8e]" },
  { key: "WED", label: "수요일", color: "text-[#8e8e8e]" },
  { key: "THU", label: "목요일", color: "text-[#8e8e8e]" },
  { key: "FRI", label: "금요일", color: "text-[#8e8e8e]" },
  { key: "SAT", label: "토요일", color: "text-[#8e8e8e]" },
  { key: "SUN", label: "일요일", color: "text-[#f56868]" },
];

// 시간 옵션 생성 (1시간 단위)
export const generateHourOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "오전" : "오후";
    options.push({
      value: hour.toString().padStart(2, "0"),
      label: `${period} ${displayHour}시`,
    });
  }
  return options;
};

// 분 옵션 생성 (10분 단위)
export const generateMinuteOptions = () => {
  const options = [];
  for (let minute = 0; minute < 60; minute += 10) {
    options.push({
      value: minute.toString().padStart(2, "0"),
      label: `${minute.toString().padStart(2, "0")}분`,
    });
  }
  return options;
};
