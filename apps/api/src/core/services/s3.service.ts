import { Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Config, type S3Config } from "../config/s3.config";

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly config: S3Config;

  constructor() {
    this.config = getS3Config();

    this.client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  get bucket(): string {
    return this.config.bucket;
  }

  /**
   * Generate a presigned PUT URL for direct browser-to-S3 upload.
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: this.config.presignedUrlTtlSeconds,
      unhoistableHeaders: new Set(["content-type"]),
    });
  }

  /**
   * Generate a presigned GET URL for protected video playback.
   * URL expires after TTL — video cannot be shared permanently.
   */
  async getPresignedDownloadUrl(
    key: string,
    ttlSeconds?: number,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: ttlSeconds ?? this.config.presignedUrlTtlSeconds,
    });
  }

  /**
   * Delete an object from S3.
   */
  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }

  /**
   * Check if an object exists and get its metadata.
   */
  async getObjectMetadata(
    key: string,
  ): Promise<{ contentLength: number; contentType: string } | null> {
    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        }),
      );

      return {
        contentLength: response.ContentLength ?? 0,
        contentType: response.ContentType ?? "application/octet-stream",
      };
    } catch {
      return null;
    }
  }

  /**
   * Build a consistent S3 key for lesson videos.
   */
  buildVideoKey(courseSlug: string, lessonId: string, extension: string): string {
    return `videos/${courseSlug}/${lessonId}.${extension}`;
  }
}