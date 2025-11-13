// 반려동물 등록 상태
export type EnrollmentStatus = "WAITING" | "APPROVED" | "REJECTED";

// 반려동물 성별
export type PetGender = "MALE" | "FEMALE";

// 반려동물 목록 조회 응답
export interface Pet {
  id: number;
  petName: string;
  petBreed: string;
  petGender: PetGender;
  petBirthday: string; // YYYYMMDD
  academyId: number;
  enrollmentStatus: EnrollmentStatus;
  academyName: string;
  petImage: string;
}

export interface PetsResponse {
  code: number;
  data: Pet[];
}

// 반려동물 상세 정보 조회 응답
export interface PetDetail {
  id: number;
  petName: string;
  petBreed: string;
  petGender: PetGender;
  petBirthday: string; // YYYYMMDD
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  academyId: number;
  academyName: string;
  academyAddress: string;
  academyAddressDetail: string;
  academySggCode: string;
  academyPhone: string;
  petImage: string;
  enrollmentStatus: EnrollmentStatus;
}

export interface PetDetailResponse {
  code: number;
  data: PetDetail;
}

