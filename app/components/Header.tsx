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
      className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="relative h-12 flex items-center px-4">
        <div className="flex-1 min-w-0 flex items-center gap-2">{left}</div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto min-w-0 truncate">
            {center ?? <h1 className="text-base font-semibold">Warr</h1>}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
          {right}
        </div>
      </div>
    </header>
  );
}
