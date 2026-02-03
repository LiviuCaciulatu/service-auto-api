import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as clientTypes from "@/entities/client/types";
import * as driverLicenseTypes from "@/entities/driver-license/types";
import * as carDocumentTypes from "@/entities/car-document/types";

export type TextractStatus = {
    status: "SUCCEEDED" | "FAILED" | "IN_PROGRESS";
    rawText?: string;
}

export type OcrResult =
    | { status: "COMPLETED"; text: string }
    | { status: "UPLOADED"; key: string };

const completed = (text: string): OcrResult => ({ status: "COMPLETED", text });
const uploaded = (key: string): OcrResult => ({ status: "UPLOADED", key });


// TODO Parsing id card---------------------------------------------------------------------------------
function normalizeLine(s: string): string {
    return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeForMatch(s: string): string {
    return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toUpperCase();
}

const LABEL_KEYWORDS =
    /\b(NUME|NOM|PRENUME|PRENOM|SEX|SEXE|CETATENIE|NATIONAL|NATIONALIT|DOMICILIU|DOMICILE|LOC NAST|LOC NA(S)?TER|EMISA|EMIS|VALAB|VALABILITATE|SERIA|NR|CNP)\b/;

export function findLabelValue(lines: string[], labels: string[]): string | undefined {
    const ulabels = labels.map(l => normalizeForMatch(l));

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const u = normalizeForMatch(line);
        for (const lab of ulabels) {
            if (!u.includes(lab)) continue;

            const inline = extractInlineValue(line, lab);
            if (inline) return inline;

            const nextLine = extractFromFollowingLines(lines, i + 1, ulabels);
            if (nextLine) return nextLine;

            return undefined;
        }
    }
    return undefined;
}

function extractInlineValue(line: string, label: string): string | undefined {
    const norm = normalizeForMatch(line);
    const idx = norm.indexOf(label);
    if (idx < 0) return undefined;

    const after = line.substring(idx + label.length).trim();
    if (!after) return undefined;

    const normAfter = normalizeForMatch(after);
    if (!LABEL_KEYWORDS.test(normAfter)) return normalizeLine(after);

    return undefined;
}

function extractFromFollowingLines(
    lines: string[],
    startIndex: number,
    labels: string[]
): string | undefined {
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const cand = normalizeLine(line);
        if (!cand) continue;

        const ucand = normalizeForMatch(cand);
        if (labels.some(l => ucand.includes(l))) continue;
        if (LABEL_KEYWORDS.test(ucand)) continue;

        return cand;
    }
    return undefined;
}

function extractCountry(lines: string[]): string | undefined {
    const idx = lines.findIndex(l =>
        /(ROMA|ROMANIA|ROUMANIE|ROU)/i.test(normalizeForMatch(l))
    );
    return idx >= 0 ? lines[idx] : undefined;
}

function extractNationality(lines: string[]): string | undefined {
    return findLabelValue(lines, ["Cetatenie", "Nationality", "Nationalite"]);
}

function extractSerieAndNumber(
    joined: string
): { serie?: string; number?: string } {
    const uJoined = normalizeForMatch(joined);

    const fullMatch = uJoined.match(
        /SERIA\s*([A-Z]{1,2})[^A-Z0-9\n]{0,6}NR\.?\s*([0-9]{4,7})/i
    );
    if (fullMatch && fullMatch[1] && fullMatch[2]) {
        return { serie: fullMatch[1], number: fullMatch[2] };
    }

    const sMatch = uJoined.match(/SERIA\s*([A-Z]{1,2})/i);
    const nMatch = uJoined.match(/\bNR\.?\s*([0-9]{4,7})/i);

    const result: { serie?: string; number?: string } = {};

    if (sMatch && sMatch[1]) {
        result.serie = sMatch[1];
    }
    if (nMatch && nMatch[1]) {
        result.number = nMatch[1];
    }

    return result;
}


function extractNames(lines: string[]): { first_name?: string; last_name?: string } {
    const result: { first_name?: string; last_name?: string } = {};

    const last = findLabelValue(lines, ["Nume", "NOM", "Last name"]);
    if (last) result.last_name = last;

    const first = findLabelValue(lines, ["Prenume", "PRENOM", "First name"]);
    if (first) result.first_name = first;

    return result;
}

function extractCnp(text: string): string | undefined {
    const match = text.match(/\b\d{13}\b/);
    return match?.[0];
}

function extractBirthplace(lines: string[]): string | undefined {
    return findLabelValue(lines, ["Loc nastere", "Place of birth", "Lieu de naissance"]);
}

function extractAddress(lines: string[]): string | undefined {
    const idx = lines.findIndex(l =>
        /DOMICILIU|DOMICILE|ADDRESS|ADRESSE/i.test(normalizeForMatch(l))
    );
    if (idx < 0) return undefined;

    const parts: string[] = [];
    for (let i = idx + 1; i < Math.min(lines.length, idx + 4); i++) {
        const line = lines[i];
        if (!line) continue;

        const u = normalizeForMatch(line);
        if (/EMISA|VALABILITATE|CNP|SERIA|NR|NUME|PRENUME|LOC NASTER/i.test(u)) break;

        parts.push(line);
    }

    return parts.length ? parts.join(" ") : undefined;
}


function extractIssuedBy(lines: string[]): string | undefined {
    return findLabelValue(lines, ["Emisa de", "Issued by", "Delivree par"]);
}

function extractValidity(lines: string[]): string | undefined {
    return findLabelValue(lines, ["Valabilitate", "Validity", "Validite"]);
}

export function parseClientIdCard(rawText: string): Partial<clientTypes.Client> {
    const rawLines = rawText
        .split(/\r?\n/)
        .map(normalizeLine)
        .filter(Boolean);

    const joined = rawLines.join(" ");

    const client: Partial<clientTypes.Client> = {
        // created_at: new Date().toISOString(),
    };

    const country = extractCountry(rawLines);
    if (country) client.country = country;

    const nationality = extractNationality(rawLines);
    if (nationality) client.nationality = nationality;

    const { serie, number } = extractSerieAndNumber(joined);
    if (serie) client.serie = serie;
    if (number) client.number = number;

    const { first_name, last_name } = extractNames(rawLines);
    if (first_name) client.first_name = first_name;
    if (last_name) client.last_name = last_name;

    const cnp = extractCnp(joined);
    if (cnp) client.cnp = cnp;

    const birthplace = extractBirthplace(rawLines);
    if (birthplace) client.birthplace = birthplace;

    const address = extractAddress(rawLines);
    if (address) client.address = address;

    const issuedBy = extractIssuedBy(rawLines);
    if (issuedBy) client.issued_by = issuedBy;

    const validity = extractValidity(rawLines);
    if (validity) client.validity = validity;

    return client;
}


// TODO Parse drivers license -------------------------------------------------------------------------------------------
// function normalizeLine(s: string): string {
//     return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
// }
//
// function normalizeForMatch(s: string): string {
//     return s.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toUpperCase();
// }

function parseDate(dateStr: string): string | undefined {
    const match = dateStr.match(/(\d{2})[./](\d{2})[./](\d{4})/);
    if (!match) return undefined;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
}

function extractAfterLabel(line: string, label: string): string | undefined {
    const u = normalizeForMatch(line);
    const ulab = normalizeForMatch(label);
    const idx = u.indexOf(ulab);
    if (idx < 0) return undefined;
    return normalizeLine(line.slice(idx + label.length).replace(/^[:.\s]+/, ""));
}

function extractLastName(lines: string[]): string | undefined {
    const line = lines.find(l => /^\s*1\./.test(l));
    return line ? extractAfterLabel(line, "1.") : undefined;
}

function extractFirstName(lines: string[]): string | undefined {
    const line = lines.find(l => /^\s*2\./.test(l));
    return line ? extractAfterLabel(line, "2.") : undefined;
}

function extractBirthData(lines: string[]): {
    date_of_birth?: string;
    birth_place?: string;
} {
    const line = lines.find(l => /^\s*3\./.test(l));
    if (!line) return {};

    const content = extractAfterLabel(line, "3.");
    if (!content) return {};

    const date = parseDate(content);
    const place = content.replace(/\d{2}[./]\d{2}[./]\d{4}/, "").trim();

    const result: {
        date_of_birth?: string;
        birth_place?: string;
    } = {};

    if (date) result.date_of_birth = date;
    if (place) result.birth_place = place;

    return result;
}

function extractIssuedInfo(lines: string[]): {
    issued_date?: string;
    issued_by?: string;
} {
    const line = lines.find(l => /4a/i.test(l));
    if (!line) return {};

    const issuedDate = line.match(/4a\s*([0-9./]{8,10})/i)?.[1];
    const issuedBy = line.match(/4c\.?\s*([A-Z\s]+)/i)?.[1];

    const result: {
        issued_date?: string;
        issued_by?: string;
    } = {};

    if (issuedDate) {
        const parsed = parseDate(issuedDate);
        if (parsed) result.issued_date = parsed;
    }

    if (issuedBy) {
        result.issued_by = issuedBy.trim();
    }

    return result;
}


function extractExpirationDate(lines: string[]): string | undefined {
    const line = lines.find(l => /4b/i.test(l));
    if (!line) return undefined;

    const expDate = line.match(/4b\.?\s*([0-9./]{8,10})/i)?.[1];
    return expDate ? parseDate(expDate) : undefined;
}

function extractLicenseNumber(lines: string[]): string | undefined {
    const line = lines.find(l => /^\s*5\./.test(l));
    return line ? extractAfterLabel(line, "5.") : undefined;
}

function extractVehicleCodes(lines: string[]): string[] | undefined {
    const line = lines.find(l => /^\s*9\./.test(l));
    if (!line) return undefined;

    const cats = extractAfterLabel(line, "9.");
    return cats ? cats.split(/\s+/).filter(Boolean) : undefined;
}

export function parseDriverLicense(rawText: string): Partial<driverLicenseTypes.DriverLicense> {
    const lines = rawText
        .split(/\r?\n/)
        .map(normalizeLine)
        .filter(Boolean);

    const result: Partial<driverLicenseTypes.DriverLicense> = {};

    const lastName = extractLastName(lines);
    if (lastName) result.last_name = lastName;

    const firstName = extractFirstName(lines);
    if (firstName) result.first_name = firstName;

    const birthData = extractBirthData(lines);
    if (birthData.date_of_birth) result.date_of_birth = birthData.date_of_birth;
    if (birthData.birth_place) result.birth_place = birthData.birth_place;

    const issuedInfo = extractIssuedInfo(lines);
    if (issuedInfo.issued_date) result.issued_date = issuedInfo.issued_date;
    if (issuedInfo.issued_by) result.issued_by = issuedInfo.issued_by;

    const expirationDate = extractExpirationDate(lines);
    if (expirationDate) result.expiration_date = expirationDate;

    const licenseNumber = extractLicenseNumber(lines);
    if (licenseNumber) result.license_number = licenseNumber;

    const vehicleCodes = extractVehicleCodes(lines);
    if (vehicleCodes) result.vehicle_codes = vehicleCodes;

    return result;
}

// -----------------------------------------------------------------------------------------------------------------

// TODO extract data from car document ---------------------------------------------------------------------------------

// function normalizeLine(s: string): string {
//     return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
// }
//
// function normalizeForMatch(s: string): string {
//     return s.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toUpperCase();
// }
//
// function extractAfterLabel(line: string, label: string): string | undefined {
//     const u = normalizeForMatch(line);
//     const ulab = normalizeForMatch(label);
//     const idx = u.indexOf(ulab);
//     if (idx < 0) return undefined;
//     return normalizeLine(line.slice(idx + label.length).replace(/^[:.\s]+/, ""));
// }

function extractProperty(lines: string[], label: string): string | undefined {
    const line = lines.find(l => normalizeForMatch(l).startsWith(label));
    return line ? extractAfterLabel(line, label) : undefined;
}

function extractPropertyA(lines: string[]): string | undefined {
    return extractProperty(lines, "A");
}

function extractPropertyJ(lines: string[]): string | undefined {
    return extractProperty(lines, "J");
}

function extractPropertyD1(lines: string[]): string | undefined {
    return extractProperty(lines, "D.1");
}

function extractPropertyD2(lines: string[]): string | undefined {
    return extractProperty(lines, "D.2");
}

function extractPropertyD3(lines: string[]): string | undefined {
    return extractProperty(lines, "D.3");
}

function extractPropertyE(lines: string[]): string | undefined {
    return extractProperty(lines, "E");
}

function extractPropertyK(lines: string[]): string | undefined {
    return extractProperty(lines, "K");
}

function extractC2(lines: string[]): {
    property_C_2_1?: string;
    property_C_2_2?: string;
    property_C_2_3?: string;
    property_C_2_equals_C_1?: boolean;
} {
    const result: {
        property_C_2_1?: string;
        property_C_2_2?: string;
        property_C_2_3?: string;
        property_C_2_equals_C_1?: boolean;
    } = {};

    const line1 = lines.find(l => l && normalizeForMatch(l).startsWith("C.2.1"));
    const val1 = line1 ? extractAfterLabel(line1, "C.2.1") : undefined;
    if (val1) result.property_C_2_1 = val1;

    const line2 = lines.find(l => l && normalizeForMatch(l).startsWith("C.2.2"));
    const val2 = line2 ? extractAfterLabel(line2, "C.2.2") : undefined;
    if (val2) result.property_C_2_2 = val2;

    const line3 = lines.find(l => l && normalizeForMatch(l).startsWith("C.2.3"));
    const val3 = line3 ? extractAfterLabel(line3, "C.2.3") : undefined;
    if (val3) result.property_C_2_3 = val3;

    if (lines.some(l => l && normalizeForMatch(l).includes("C2=C1"))) {
        result.property_C_2_equals_C_1 = true;
    }

    return result;
}


function extractC3(lines: string[]): {
    property_C_3_1?: string;
    property_C_3_2?: string;
    property_C_3_3?: string;
    property_C_3_equals_C_1?: boolean;
} {
    const result: {
        property_C_3_1?: string;
        property_C_3_2?: string;
        property_C_3_3?: string;
        property_C_3_equals_C_1?: boolean;
    } = {};

    const line1 = lines.find(l => l && normalizeForMatch(l).startsWith("C.3.1"));
    const val1 = line1 ? extractAfterLabel(line1, "C.3.1") : undefined;
    if (val1) result.property_C_3_1 = val1;

    const line2 = lines.find(l => l && normalizeForMatch(l).startsWith("C.3.2"));
    const val2 = line2 ? extractAfterLabel(line2, "C.3.2") : undefined;
    if (val2) result.property_C_3_2 = val2;

    const line3 = lines.find(l => l && normalizeForMatch(l).startsWith("C.3.3"));
    const val3 = line3 ? extractAfterLabel(line3, "C.3.3") : undefined;
    if (val3) result.property_C_3_3 = val3;

    if (lines.some(l => l && normalizeForMatch(l).includes("C3=C1"))) {
        result.property_C_3_equals_C_1 = true;
    }

    return result;
}

function extractPropertyB(lines: string[]): string | undefined {
    return extractProperty(lines, "B");
}

function extractPropertyH(lines: string[]): string | undefined {
    return extractProperty(lines, "H");
}

function extractPropertyI(lines: string[]): string | undefined {
    return extractProperty(lines, "I");
}

function extractPropertyI1(lines: string[]): string | undefined {
    return extractProperty(lines, "I.1");
}

function extractPropertyF1(lines: string[]): string | undefined {
    return extractProperty(lines, "F.1");
}

function extractPropertyG(lines: string[]): string | undefined {
    return extractProperty(lines, "G");
}

function extractPropertyP1(lines: string[]): string | undefined {
    return extractProperty(lines, "P.1");
}

function extractPropertyP2(lines: string[]): string | undefined {
    return extractProperty(lines, "P.2");
}

function extractPropertyP3(lines: string[]): string | undefined {
    return extractProperty(lines, "P.3");
}

function extractPropertyQ(lines: string[]): string | undefined {
    return extractProperty(lines, "Q");
}

function extractPropertyR(lines: string[]): string | undefined {
    return extractProperty(lines, "R");
}

function extractPropertyS1(lines: string[]): string | undefined {
    return extractProperty(lines, "S.1");
}

function extractPropertyS2(lines: string[]): string | undefined {
    return extractProperty(lines, "S.2");
}

function extractPropertyV7(lines: string[]): string | undefined {
    return extractProperty(lines, "V.7");
}

function extractPropertyV10(lines: string[]): string | undefined {
    return extractProperty(lines, "V.10");
}

function extractPropertyY(lines: string[]): string | undefined {
    return extractProperty(lines, "Y");
}

function extractPropertyZ(lines: string[]): string | undefined {
    return extractProperty(lines, "Z");
}

function extractObservatii(lines: string[]): string | undefined {
    const idx = lines.findIndex(l => l && normalizeForMatch(l).startsWith("OBSERVATII"));
    if (idx < 0) return undefined;

    const parts: string[] = [];
    for (let i = idx + 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue; // skip undefined lines

        const u = normalizeForMatch(line);
        if (/^C\.|^NUMARUL CERTIFICATULUI/i.test(u)) break;

        parts.push(line);
    }

    return parts.length ? parts.join(" ") : undefined;
}

function extractNumarCertificat(lines: string[]): string | undefined {
    const line = lines.find(l =>
        /NUMARUL CERTIFICATULUI/i.test(normalizeForMatch(l))
    );
    if (!line) return undefined;

    const match = line.match(/:\s*([A-Z0-9]+)/i);
    return match?.[1];
}

export function parseCarDocument(rawText: string): Partial<carDocumentTypes.CarDocument> {
    const lines = rawText
        .split(/\r?\n/)
        .map(normalizeLine)
        .filter(Boolean);

    const result: Partial<carDocumentTypes.CarDocument> = {};

    const A = extractPropertyA(lines);
    if (A) result.property_A = A;

    const J = extractPropertyJ(lines);
    if (J) result.property_J = J;

    const D1 = extractPropertyD1(lines);
    if (D1) result.property_D_1 = D1;

    const D2 = extractPropertyD2(lines);
    if (D2) result.property_D_2 = D2;

    const D3 = extractPropertyD3(lines);
    if (D3) result.property_D_3 = D3;

    const E = extractPropertyE(lines);
    if (E) result.property_E = E;

    const K = extractPropertyK(lines);
    if (K) result.property_K = K;

    const C2 = extractC2(lines);
    if (C2.property_C_2_1) result.property_C_2_1 = C2.property_C_2_1;
    if (C2.property_C_2_2) result.property_C_2_2 = C2.property_C_2_2;
    if (C2.property_C_2_3) result.property_C_2_3 = C2.property_C_2_3;
    if (C2.property_C_2_equals_C_1 !== undefined) result.property_C_2_equals_C_1 = C2.property_C_2_equals_C_1;

    const C3 = extractC3(lines);
    if (C3.property_C_3_1) result.property_C_3_1 = C3.property_C_3_1;
    if (C3.property_C_3_2) result.property_C_3_2 = C3.property_C_3_2;
    if (C3.property_C_3_3) result.property_C_3_3 = C3.property_C_3_3;
    if (C3.property_C_3_equals_C_1 !== undefined) result.property_C_3_equals_C_1 = C3.property_C_3_equals_C_1;

    const B = extractPropertyB(lines);
    if (B) result.property_B = B;

    const H = extractPropertyH(lines);
    if (H) result.property_H = H;

    const I = extractPropertyI(lines);
    if (I) result.property_I = I;

    const I1 = extractPropertyI1(lines);
    if (I1) result.property_I_1 = I1;

    const F1 = extractPropertyF1(lines);
    if (F1) result.property_F_1 = F1;

    const G = extractPropertyG(lines);
    if (G) result.property_G = G;

    const P1 = extractPropertyP1(lines);
    if (P1) result.property_P_1 = P1;

    const P2 = extractPropertyP2(lines);
    if (P2) result.property_P_2 = P2;

    const P3 = extractPropertyP3(lines);
    if (P3) result.property_P_3 = P3;

    const Q = extractPropertyQ(lines);
    if (Q) result.property_Q = Q;

    const R = extractPropertyR(lines);
    if (R) result.property_R = R;

    const S1 = extractPropertyS1(lines);
    if (S1) result.property_S_1 = S1;

    const S2 = extractPropertyS2(lines);
    if (S2) result.property_S_2 = S2;

    const V7 = extractPropertyV7(lines);
    if (V7) result.property_V_7 = V7;

    const V10 = extractPropertyV10(lines);
    if (V10) result.property_V_10 = V10;

    const Y = extractPropertyY(lines);
    if (Y) result.property_Y = Y;

    const Z = extractPropertyZ(lines);
    if (Z) result.property_Z = Z;

    const obs = extractObservatii(lines);
    if (obs) result.observatii = obs;

    const numarCertificat = extractNumarCertificat(lines);
    if (numarCertificat) result.numar_certificat = numarCertificat;

    return result;
}





// TODO extract Text from file -----------------------------------------------------------------------------------------

export const extractTextFromFile = async (filePath: string):Promise<OcrResult> => {
    const preparedFilePath = await prepareFileForOcr(filePath);
    const response = await sendFileToOcrApi(preparedFilePath);
    return handleApiResponse(response);
};

const prepareFileForOcr = async (filePath: string): Promise<string> => {
    if (path.extname(filePath).toLocaleLowerCase() !== ".pdf") return filePath;
    return convertPdfToImage(filePath);
}

const convertPdfToImage = async (pdfPath: string): Promise<string> => {
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
};

async function sendFileToOcrApi (filePath: string) {
    const FormData = require('form-data');
    const form = new FormData;
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

const handleApiResponse = async (json: any): Promise<OcrResult> => {
    if (json.rawText) return completed(json.rawText);
    if (json.jobId) return pollTextractJob(json.jobId);
    if (json.key) return uploaded(json.key);
    throw new Error("Unexpected Textract API response");
};

const pollTextractJob = async (jobId: string): Promise<OcrResult> => {
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
};

const fetchTextractStatus = async (jobId: string): Promise<TextractStatus> => {
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

    return await res.json() as Promise<TextractStatus>;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

