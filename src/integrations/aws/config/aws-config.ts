const regionFromEnv = process.env.AWS_REGION;
if (!regionFromEnv) throw new Error('AWS_REGION is not set');
export const AWS_REGION = regionFromEnv;

const bucketFromEnv = process.env.AWS_S3_BUCKET_NAME;
if (!bucketFromEnv) throw new Error('AWS_S3_BUCKET_NAME is not set');
export const AWS_S3_BUCKET_NAME = bucketFromEnv;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const AWS_BASE_CONFIG = {
    region: AWS_REGION,
    ...(accessKeyId && secretAccessKey ? {
            credentials: {
                accessKeyId, secretAccessKey
            }
        } : {}

    )

} as const;