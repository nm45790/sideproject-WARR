"use client";

import { useState, useEffect } from "react";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
}: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate));
  }, [selectedDate]);

  if (!isOpen) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 해당 월의 첫날과 마지막날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 달력 시작일 (일요일부터 시작)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // 달력에 표시할 날짜들 생성
  const calendarDays: Date[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[768px] rounded-t-[20px] pb-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 배경 */}
        <div className="absolute top-0 left-0 right-0 h-[93px] bg-gradient-to-b from-[#f8f8f8] to-white rounded-t-[20px]" />

        {/* 닫기 버튼 */}
        <div className="relative pt-6 px-6">
          <button
            onClick={onClose}
            className="text-[#363e4a] text-[20px] leading-none font-light"
          >
            ✕
          </button>
        </div>

        {/* 년/월 표시 및 이동 버튼 */}
        <div className="relative flex items-center justify-center gap-[16px] mt-[54px] mb-[60px]">
          <button
            onClick={handlePrevMonth}
            className="bg-[#f6f6f6] rounded-[7px] w-[44px] h-[44px] flex items-center justify-center"
          >
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
              <path
                d="M15 7L10 11L15 15"
                stroke="#363e4a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className="font-bold text-[#363e4a] text-[25px] leading-normal min-w-[160px] text-center">
            {year}년 {String(month + 1).padStart(2, "0")}월
          </p>

          <button
            onClick={handleNextMonth}
            className="bg-[#f6f6f6] rounded-[7px] w-[44px] h-[44px] flex items-center justify-center"
          >
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
              <path
                d="M11 7L16 11L11 15"
                stroke="#363e4a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-[22px] mb-[13px]">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div
              key={day}
              className="flex items-center justify-center h-[44px]"
            >
              <p
                className={`font-medium text-[12px] leading-normal ${
                  index === 0 ? "text-[#f56868]" : "text-[#6e7783]"
                }`}
              >
                {day}
              </p>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 px-[22px]">
          {calendarDays.slice(0, 35).map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isInCurrentMonth = isCurrentMonth(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-[44px] w-[44px] rounded-[7px] flex items-center justify-center mx-auto
                  ${isSelected ? "bg-[#3f59ff]" : "bg-white"}
                  ${!isInCurrentMonth ? "opacity-30" : ""}
                `}
              >
                <p
                  className={`font-bold text-[16px] leading-normal ${
                    isSelected ? "text-white" : "text-[#363e4a]"
                  }`}
                >
                  {date.getDate()}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
