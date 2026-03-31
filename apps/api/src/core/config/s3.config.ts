export interface S3Config {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  presignedUrlTtlSeconds: number;
}

const DEFAULT_PRESIGNED_TTL_SECONDS = 3600;

export function getS3Config(env: NodeJS.ProcessEnv = process.env): S3Config {
  const accessKeyId = env.S3_ACCESS_KEY_ID ?? "";
  const secretAccessKey = env.S3_SECRET_ACCESS_KEY ?? "";
  const bucket = env.S3_BUCKET ?? "";
  const endpoint = env.S3_ENDPOINT ?? "";

  if (env.NODE_ENV === "production" && (!accessKeyId || !secretAccessKey || !bucket || !endpoint)) {
    throw new Error(
      "S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET, and S3_ENDPOINT must be set in production",
    );
  }

  return {
    endpoint,
    region: env.S3_REGION ?? "ru-msk",
    bucket,
    accessKeyId,
    secretAccessKey,
    presignedUrlTtlSeconds: Number(env.S3_PRESIGNED_TTL_SECONDS) || DEFAULT_PRESIGNED_TTL_SECONDS,
  };
}