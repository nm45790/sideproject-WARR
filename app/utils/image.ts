/**
 * S3 이미지 키를 전체 URL로 변환
 */
export function getImageUrl(imageKey: string | null | undefined): string | null {
  if (!imageKey) return null;

  // 이미 전체 URL인 경우 그대로 반환
  if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
    return imageKey;
  }

  // S3 버킷 URL (환경 변수로 관리 가능)
  const S3_BUCKET_URL = "https://waal-dev.s3.ap-northeast-2.amazonaws.com";

  return `${S3_BUCKET_URL}/${imageKey}`;
}

