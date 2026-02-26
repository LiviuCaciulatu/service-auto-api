import * as carDocumentTypes from "@/entities/car-document/types";
import {
    extractAfterLabel,
    normalizeForMatch,
    normalizeLine
} from "@/integrations/aws/services/aws-text-extract-service";

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
    if (A) result.property_a = A;

    const J = extractPropertyJ(lines);
    if (J) result.property_j = J;

    const D1 = extractPropertyD1(lines);
    if (D1) result.property_d_1 = D1;

    const D2 = extractPropertyD2(lines);
    if (D2) result.property_d_2 = D2;

    const D3 = extractPropertyD3(lines);
    if (D3) result.property_d_3 = D3;

    const E = extractPropertyE(lines);
    if (E) result.property_e = E;

    const K = extractPropertyK(lines);
    if (K) result.property_k = K;

    const C2 = extractC2(lines);
    if (C2.property_C_2_1) result.property_c_2_1 = C2.property_C_2_1;
    if (C2.property_C_2_2) result.property_c_2_2 = C2.property_C_2_2;
    if (C2.property_C_2_3) result.property_c_2_3 = C2.property_C_2_3;
    if (C2.property_C_2_equals_C_1 !== undefined) result.property_c_2_equals_c_1 = C2.property_C_2_equals_C_1;

    const C3 = extractC3(lines);
    if (C3.property_C_3_1) result.property_c_3_1 = C3.property_C_3_1;
    if (C3.property_C_3_2) result.property_c_3_2 = C3.property_C_3_2;
    if (C3.property_C_3_3) result.property_c_3_3 = C3.property_C_3_3;
    if (C3.property_C_3_equals_C_1 !== undefined) result.property_c_3_equals_c_1 = C3.property_C_3_equals_C_1;

    const B = extractPropertyB(lines);
    if (B) result.property_b = B;

    const H = extractPropertyH(lines);
    if (H) result.property_h = H;

    const I = extractPropertyI(lines);
    if (I) result.property_i = I;

    const I1 = extractPropertyI1(lines);
    if (I1) result.property_i_1 = I1;

    const F1 = extractPropertyF1(lines);
    if (F1) result.property_f_1 = F1;

    const G = extractPropertyG(lines);
    if (G) result.property_g = G;

    const P1 = extractPropertyP1(lines);
    if (P1) result.property_p_1 = P1;

    const P2 = extractPropertyP2(lines);
    if (P2) result.property_p_2 = P2;

    const P3 = extractPropertyP3(lines);
    if (P3) result.property_p_3 = P3;

    const Q = extractPropertyQ(lines);
    if (Q) result.property_q = Q;

    const R = extractPropertyR(lines);
    if (R) result.property_r = R;

    const S1 = extractPropertyS1(lines);
    if (S1) result.property_s_1 = S1;

    const S2 = extractPropertyS2(lines);
    if (S2) result.property_s_2 = S2;

    const V7 = extractPropertyV7(lines);
    if (V7) result.property_v_7 = V7;

    const V10 = extractPropertyV10(lines);
    if (V10) result.property_v_10 = V10;

    const Y = extractPropertyY(lines);
    if (Y) result.property_y = Y;

    const Z = extractPropertyZ(lines);
    if (Z) result.property_z = Z;

    const obs = extractObservatii(lines);
    if (obs) result.observatii = obs;

    const numarCertificat = extractNumarCertificat(lines);
    if (numarCertificat) result.numar_certificat = numarCertificat;

    return result;
}