import path from "path";
import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { createCanvas } from "canvas";
import * as types from "@/integrations/aws/types";
import {
    TextractClient,
    DetectDocumentTextCommand,
} from "@aws-sdk/client-textract";

const textractClient = new TextractClient({
    region: process.env.AWS_REGION || "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/* -------------------- MAIN OCR FUNCTION -------------------- */

export async function extractTextFromFile(filePathOrUrl: string): Promise<types.OcrResult> {
    const { bucket, key } = parseS3Url(filePathOrUrl);

    const command = new DetectDocumentTextCommand({
        Document: {
            S3Object: {
                Bucket: bucket,
                Name: key,
            },
        },
    });

    const response = await textractClient.send(command);
    const text = extractRawText(response);

    return completed(text);
}

/* -------------------- HELPERS -------------------- */

function parseS3Url(url: string): { bucket: string; key: string } {
    const u = new URL(url);

    // TypeScript now knows bucket and key are strings
    const bucket = u.hostname.split(".")[0]!;
    const key = decodeURIComponent(u.pathname.replace(/^\/+/, ""));

    if (!bucket || !key) {
        throw new Error(`Invalid S3 URL: ${url}`);
    }

    return { bucket, key };
}

function extractRawText(response: any): string {
    if (!response?.Blocks) return "";
    return response.Blocks
        .filter((b: any) => b.BlockType === "LINE" && b.Text)
        .map((b: any) => b.Text)
        .join("\n");
}

export function completed(text: string): types.OcrResult {
    return { status: "COMPLETED", text };
}

export function uploaded(key: string): types.OcrResult {
    return { status: "UPLOADED", key };
}

export function parseDate(dateStr: string): string | undefined {
    const match = dateStr.match(/(\d{2})[./](\d{2})[./](\d{4})/);
    if (!match) return undefined;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
}

export function normalizeLine(s: string): string {
    return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeForMatch(s: string): string {
    return s.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toUpperCase();
}

export function extractAfterLabel(line: string, label: string): string | undefined {
    const u = normalizeForMatch(line);
    const ulab = normalizeForMatch(label);
    const idx = u.indexOf(ulab);
    if (idx < 0) return undefined;
    return normalizeLine(line.slice(idx + label.length).replace(/^[:.\s]+/, ""));
}
