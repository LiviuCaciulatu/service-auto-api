export type S3UploadResult = {
    key: string;
    url: string;
}

export type S3UploadInput = {
    buffer: Buffer;
    mimeType: string;
    originalName: string;
    prefix?: string;
    bucket?: string;
}


export type TextractStatus = {
    status: "SUCCEEDED" | "FAILED" | "IN_PROGRESS";
    rawText?: string;
}

export type OcrResult =
    | { status: "COMPLETED"; text: string }
    | { status: "UPLOADED"; key: string };
