import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TermsSelectOption {
  service: boolean;
  privacy: boolean;
  thirdParty: boolean;
  payment: boolean;
  marketing: boolean;
}

export interface ScheduleItem {
  dayOfWeek: string;
  isOpen: boolean;
  operatingStartTime: string;
  operatingEndTime: string;
}

export interface SignupData {
  memberId: string;
  memberPassword: string;
  memberPhone: string;
  memberName: string;
  memberEmail: string;
  termsSelectOption: TermsSelectOption;
  // Academy signup data
  academyName: string;
  academyAddress: string;
  academyAddressDetail: string;
  sggCode: string;
  academyPhone: string;
  maxCapacity: number;
  scheduleList: ScheduleItem[];
  imageKey: string;
  // Onboarding status
  isAcademyOnboardingCompleted: boolean;
}

interface SignupStore {
  // 상태
  signupData: SignupData;

  // 액션
  updateMemberId: (memberId: string) => void;
  updateMemberPassword: (memberPassword: string) => void;
  updateMemberPhone: (memberPhone: string) => void;
  updateMemberName: (memberName: string) => void;
  updateMemberEmail: (memberEmail: string) => void;
  updateTermsSelectOption: (terms: Partial<TermsSelectOption>) => void;
  updateSignupData: (data: Partial<SignupData>) => void;
  resetSignupData: () => void;

  // Academy signup actions
  updateAcademyName: (academyName: string) => void;
  updateAcademyAddress: (academyAddress: string) => void;
  updateAcademyAddressDetail: (academyAddressDetail: string) => void;
  updateSggCode: (sggCode: string) => void;
  updateAcademyPhone: (academyPhone: string) => void;
  updateMaxCapacity: (maxCapacity: number) => void;
  updateScheduleList: (scheduleList: ScheduleItem[]) => void;
  updateImageKey: (imageKey: string) => void;
  updateAcademyOnboardingCompleted: (completed: boolean) => void;

  // 유틸리티
  isAllRequiredTermsAgreed: () => boolean;
  isSignupDataComplete: () => boolean;
  isDetailsDataComplete: () => boolean;
  isAcademyOnboardingCompleted: () => boolean;
}

const initialSignupData: SignupData = {
  memberId: "",
  memberPassword: "",
  memberPhone: "",
  memberName: "",
  memberEmail: "",
  termsSelectOption: {
    service: false,
    privacy: false,
    thirdParty: false,
    payment: false,
    marketing: false,
  },
  // Academy signup data
  academyName: "",
  academyAddress: "",
  academyAddressDetail: "",
  sggCode: "",
  academyPhone: "",
  maxCapacity: 0,
  scheduleList: [],
  imageKey: "",
  isAcademyOnboardingCompleted: false,
};

export const useSignupStore = create<SignupStore>()((set, get) => ({
  // 초기 상태
  signupData: initialSignupData,

  // 회원 ID 업데이트
  updateMemberId: (memberId) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        memberId,
      },
    })),

  // 회원 비밀번호 업데이트
  updateMemberPassword: (memberPassword) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        memberPassword,
      },
    })),

  // 회원 전화번호 업데이트
  updateMemberPhone: (memberPhone) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        memberPhone,
      },
    })),

  // 회원 이름 업데이트
  updateMemberName: (memberName) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        memberName,
      },
    })),

  // 회원 이메일 업데이트
  updateMemberEmail: (memberEmail) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        memberEmail,
      },
    })),

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

  // Academy signup actions
  updateAcademyName: (academyName) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        academyName,
      },
    })),

  updateAcademyAddress: (academyAddress) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        academyAddress,
      },
    })),

  updateAcademyAddressDetail: (academyAddressDetail) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        academyAddressDetail,
      },
    })),

  updateSggCode: (sggCode) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        sggCode,
      },
    })),

  updateAcademyPhone: (academyPhone) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        academyPhone,
      },
    })),

  updateMaxCapacity: (maxCapacity) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        maxCapacity,
      },
    })),

  updateScheduleList: (scheduleList) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        scheduleList,
      },
    })),

  updateImageKey: (imageKey) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        imageKey,
      },
    })),

  updateAcademyOnboardingCompleted: (completed) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        isAcademyOnboardingCompleted: completed,
      },
    })),

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
      signupData.memberName?.trim() !== "" &&
      signupData.memberPhone?.trim() !== "" &&
      signupData.memberEmail?.trim() !== "" &&
      signupData.memberId?.trim() !== "" &&
      signupData.memberPassword?.trim() !== ""
    );
  },

  // 상세 데이터가 완성되었는지 확인
  isDetailsDataComplete: () => {
    const { signupData } = get();
    return (
      signupData.memberName?.trim() !== "" &&
      signupData.memberPhone?.trim() !== "" &&
      signupData.memberEmail?.trim() !== ""
    );
  },

  // Academy 온보딩 완료 여부 확인
  isAcademyOnboardingCompleted: () => {
    return get().signupData.isAcademyOnboardingCompleted;
  },
}));
