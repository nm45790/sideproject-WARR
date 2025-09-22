import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TermsSelectOption {
  service: boolean;
  privacy: boolean;
  thirdParty: boolean;
  payment: boolean;
  marketing: boolean;
}

export interface SignupData {
  termsSelectOption: TermsSelectOption;
  name: string;
  phone: string;
  email: string;
}

interface SignupStore {
  // 상태
  signupData: SignupData;

  // 액션
  updateTermsSelectOption: (terms: Partial<TermsSelectOption>) => void;
  updateName: (name: string) => void;
  updatePhone: (phone: string) => void;
  updateEmail: (email: string) => void;
  updateSignupData: (data: Partial<SignupData>) => void;
  resetSignupData: () => void;

  // 유틸리티
  isAllRequiredTermsAgreed: () => boolean;
  isSignupDataComplete: () => boolean;
}

const initialSignupData: SignupData = {
  termsSelectOption: {
    service: false,
    privacy: false,
    thirdParty: false,
    payment: false,
    marketing: false,
  },
  name: "",
  phone: "",
  email: "",
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      signupData: initialSignupData,

      // 약관 동의 업데이트
      updateTermsSelectOption: (terms) =>
        set((state) => ({
          signupData: {
            ...state.signupData,
            termsSelectOption: {
              ...state.signupData.termsSelectOption,
              ...terms,
            },
          },
        })),

      // 이름 업데이트
      updateName: (name) =>
        set((state) => ({
          signupData: {
            ...state.signupData,
            name,
          },
        })),

      // 전화번호 업데이트
      updatePhone: (phone) =>
        set((state) => ({
          signupData: {
            ...state.signupData,
            phone,
          },
        })),

      // 이메일 업데이트
      updateEmail: (email) =>
        set((state) => ({
          signupData: {
            ...state.signupData,
            email,
          },
        })),

      // 전체 데이터 업데이트
      updateSignupData: (data) =>
        set((state) => ({
          signupData: {
            ...state.signupData,
            ...data,
          },
        })),

      // 데이터 초기화
      resetSignupData: () =>
        set({
          signupData: initialSignupData,
        }),

      // 필수 약관 모두 동의했는지 확인
      isAllRequiredTermsAgreed: () => {
        const { termsSelectOption } = get().signupData;
        return (
          termsSelectOption.service &&
          termsSelectOption.privacy &&
          termsSelectOption.thirdParty &&
          termsSelectOption.payment
        );
      },

      // 회원가입 데이터가 완성되었는지 확인
      isSignupDataComplete: () => {
        const { signupData } = get();
        return (
          get().isAllRequiredTermsAgreed() &&
          signupData.name.trim() !== "" &&
          signupData.phone.trim() !== "" &&
          signupData.email.trim() !== ""
        );
      },
    }),
    {
      name: "signup-store", // localStorage 키
      partialize: (state) => ({ signupData: state.signupData }), // 저장할 데이터 선택
    },
  ),
);
