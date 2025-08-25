"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type HeaderSlots = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

type HeaderSlotsContextValue = {
  slots: HeaderSlots;
  setSlots: (slots: HeaderSlots) => void;
};

export const HeaderSlotsContext = createContext<HeaderSlotsContextValue | null>(
  null,
);

export function HeaderSlotsProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<HeaderSlots>({});
  const value = useMemo(() => ({ slots, setSlots }), [slots]);
  return (
    <HeaderSlotsContext.Provider value={value}>
      {children}
    </HeaderSlotsContext.Provider>
  );
}

export function HeaderSlot(props: HeaderSlots) {
  const ctx = useContext(HeaderSlotsContext);
  useEffect(() => {
    ctx?.setSlots(props);
    return () => ctx?.setSlots({});
  }, [ctx, props]);
  return null;
}

export function useHeaderSlots() {
  const ctx = useContext(HeaderSlotsContext);
  if (!ctx)
    throw new Error("useHeaderSlots must be used within HeaderSlotsProvider");
  return ctx;
}
