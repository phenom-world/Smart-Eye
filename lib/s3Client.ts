import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? '';
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? '';
export const region = process.env.NEXT_PUBLIC_S3_UPLOAD_REGION ?? 'ca-central-1';
const bucket = process.env.NEXT_PUBLIC_S3_UPLOAD_BUCKET_NAME ?? 'altoheal';
const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT ?? '';

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
  endpoint,
  forcePathStyle: true,
});

export const uploadMedia = async (file: File, mediaId: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: mediaId,
    Body: file,
  });

  return await s3.send(command);
};

export const getObjectURL = async (mediaId: string, expiry?: number) => {
  if (!mediaId) return '';
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: mediaId,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: Number(process.env.NEXT_PUBLIC_S3_GET_PRESIGNED_EXPIRES) || expiry });
  return url;
};

export const deleteMedia = async (mediaId: string) => {
  const command = {
    Bucket: bucket,
    Key: mediaId,
  };
  return await s3.send(new DeleteObjectCommand(command));
};
