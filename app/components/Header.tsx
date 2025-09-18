"use client";
import { ReactNode } from "react";

type HeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function Header({ left, center, right }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 bg-white border-b border-gray-100"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="relative h-14 flex items-center px-5">
        <div className="flex-1 min-w-0 flex items-center gap-2">{left}</div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto min-w-0 truncate">
            {center && center}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
          {right}
        </div>
      </div>
    </header>
  );
}
