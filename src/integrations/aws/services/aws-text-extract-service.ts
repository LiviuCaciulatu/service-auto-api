import path from "path";
import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import {createCanvas} from "canvas";
import * as types from "@/integrations/aws/types";
import FormData from 'form-data';

export async function extractTextFromFile  (filePath: string):Promise<types.OcrResult> {
    const preparedFilePath = await prepareFileForOcr(filePath);
    const response = await sendFileToOcrApi(preparedFilePath);
    return handleApiResponse(response);
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
    return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toUpperCase();
}

export function extractAfterLabel(line: string, label: string): string | undefined {
    const u = normalizeForMatch(line);
    const ulab = normalizeForMatch(label);
    const idx = u.indexOf(ulab);
    if (idx < 0) return undefined;
    return normalizeLine(line.slice(idx + label.length).replace(/^[:.\s]+/, ""));
}

export function completed  (text: string): types.OcrResult {return{ status: "COMPLETED", text }}
export function uploaded  (key: string): types.OcrResult  {return{ status: "UPLOADED", key }}

async function prepareFileForOcr (filePath: string): Promise<string> {
    if (path.extname(filePath).toLocaleLowerCase() !== ".pdf") return filePath;
    return convertPdfToImage(filePath);
}

async function convertPdfToImage  (pdfPath: string): Promise<string>  {
    try {
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = pdfjsLib.getDocument({ data, disableWorker: true });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = createCanvas(
            Math.ceil(viewport.width),
            Math.ceil(viewport.height)
        );
        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport }).promise;

        const outputPath = pdfPath.replace(/\.pdf$/i, ".jpg");
        const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
        fs.writeFileSync(outputPath, buffer);

        return outputPath;
    } catch (err: any) {
        console.error("PDF -> JPEG conversion failed", err);
        throw err;
    }
}

async function sendFileToOcrApi (filePath: string) {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const apiBase = process.env.API_BASE_URL || "";
    const res = await fetch(`${apiBase}/api/extract-textract`, {
        method: "POST",
        body: form,
        headers: form.getHeaders()
    })

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || res.statusText);
    }

    return res.json();
}

async function handleApiResponse (json: any): Promise<types.OcrResult> {
    if (json.rawText) return completed(json.rawText);
    if (json.jobId) return pollTextractJob(json.jobId);
    if (json.key) return uploaded(json.key);
    throw new Error("Unexpected Textract API response");
}

async function pollTextractJob  (jobId: string): Promise<types.OcrResult>  {
    console.log(`Started Textract job ${jobId}. Waiting for result...`);
    const maxAttempts = 30;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        await delay(2000);
        const status = await fetchTextractStatus(jobId);

        switch (status.status) {
            case "SUCCEEDED":
                return completed(status.rawText || "");
            case "FAILED":
                throw new Error(`Textract job ${jobId} failed`);
            case "IN_PROGRESS":
                console.log(`Textract job ${jobId} in progress...`);
                break;
        }
    }

    throw new Error(`Timed out waiting for Textract job ${jobId}`);
}

async function fetchTextractStatus  (jobId: string): Promise<types.TextractStatus>  {
    const apiBase = process.env.API_BASE_URL || "";
    const res = await fetch(`${apiBase}/api/textract-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
    });

    if (!res.ok) {
        const t = await res.text();
        throw new Error(t || res.statusText);
    }

    return await res.json() as Promise<types.TextractStatus>;
}

async function delay (ms: number){
    return new Promise((res) => setTimeout(res, ms));
}