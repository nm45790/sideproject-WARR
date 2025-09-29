// 카카오 주소검색 API 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          postcode: string;
          postcode1: string;
          postcode2: string;
          postcodeSeq: string;
          zonecode: string;
          address: string;
          addressEnglish: string;
          addressType: string;
          apartment: string;
          autoJibunAddress: string;
          autoJibunAddressEnglish: string;
          autoRoadAddress: string;
          autoRoadAddressEnglish: string;
          bcode: string;
          bname: string;
          bname1: string;
          bname1English: string;
          bname2: string;
          bname2English: string;
          bnameEnglish: string;
          buildingCode: string;
          buildingName: string;
          hname: string;
          jibunAddress: string;
          jibunAddressEnglish: string;
          noSelected: string;
          query: string;
          roadAddress: string;
          roadAddressEnglish: string;
          roadname: string;
          roadnameCode: string;
          roadnameEnglish: string;
          sido: string;
          sidoEnglish: string;
          sigungu: string;
          sigunguCode: string;
          sigunguEnglish: string;
          userLanguageType: string;
          userSelectedType: string;
          x: string;
          y: string;
        }) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
        embed: (container: HTMLElement) => void;
      };
    };
  }
}

export {};
