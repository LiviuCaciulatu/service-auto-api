// citeste regiunea AWS din env
const regionFromEnv = process.env.AWS_REGION;
if (!regionFromEnv) throw new Error('AWS_REGION is not set');
export const AWS_REGION = regionFromEnv;

// citeste numele bucket-ului AWS din env
const bucketFromEnv = process.env.AWS_S3_BUCKET_NAME;
if (!bucketFromEnv) throw new Error('AWS_S3_BUCKET_NAME is not set');
export const AWS_S3_BUCKET_NAME = bucketFromEnv;

// citeste credentialele AWS din env
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// configureaza clientul AWS
export const AWS_BASE_CONFIG = {
    region: AWS_REGION,
    ...(accessKeyId && secretAccessKey ? {
            credentials: {
                accessKeyId, secretAccessKey
            }
        } : {}

    )

} as const;