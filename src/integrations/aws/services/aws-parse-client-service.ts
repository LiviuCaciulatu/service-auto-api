import * as clientTypes from "@/entities/client/types";
import {normalizeForMatch, normalizeLine} from "@/integrations/aws/services/aws-text-extract-service";

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
    const labelIndex = lines.findIndex(line =>
        /CETAT|NATIONAL/i.test(normalizeForMatch(line))
    );

    if (labelIndex === -1) return undefined;

    for (let i = labelIndex + 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw) continue;

        const normalized = normalizeLine(raw);
        if (!normalized) continue;

        const upper = normalizeForMatch(normalized);

        // Skip other label lines like Sex/Sexe/Sex
        if (LABEL_KEYWORDS.test(upper)) continue;

        // Skip gender line if just M/F
        if (/^(M|F)$/i.test(normalized)) continue;

        // If the line is in the format: Romana / ROU, take first part
        if (normalized.includes("/")) {
            const parts = normalized.split("/");
            const value = parts[0]?.trim();
            if (value) return value;
        }

        // Otherwise, return the line itself
        return normalized;
    }

    return undefined;
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
    const labelIndex = lines.findIndex(line =>
        /LOC\s*NAST|PLACE\s*OF\s*BIRTH|LIEU\s*DE\s*NAISS/i.test(
            normalizeForMatch(line)
        )
    );

    if (labelIndex === -1) return undefined;

    for (let i = labelIndex + 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw) continue;

        const normalized = normalizeLine(raw);
        if (!normalized) continue;

        const upper = normalizeForMatch(normalized);

        // Stop if another label starts
        if (LABEL_KEYWORDS.test(upper)) break;

        return normalized;
    }

    return undefined;
}

function extractAddress(lines: string[]): string | undefined {
    const labelIndex = lines.findIndex(line =>
        /DOMICILIU|DOMICILE|ADDRESS|ADRESSE/i.test(normalizeForMatch(line))
    );

    if (labelIndex === -1) return undefined;

    const parts: string[] = [];

    for (let i = labelIndex + 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw) continue;

        const normalized = normalizeLine(raw);
        if (!normalized) continue;

        const upper = normalizeForMatch(normalized);

        // Stop if we reach another major label block
        if (
            /EMISA|DELIVREE|ISSUED|VALABIL|VALIDIT|CNP|SERIA|NR|NUME|PRENUME|LOC\s*NAST/i.test(
                upper
            )
        ) {
            break;
        }

        const isGarbage =
            normalized.length < 3 ||
            !/[a-zA-Z]/.test(normalized) || // no letters → probably garbage
            /^[0-9]{1,3}\s?[a-z]{1,3}$/i.test(normalized); // small OCR code

        if (isGarbage) continue;

        parts.push(normalized);
    }

    return parts.length ? parts.join(" ") : undefined;
}

function extractIssuedBy(lines: string[]): string | undefined {
    const labelIndex = lines.findIndex(line =>
        /EMISA|ISSUED|DELIVREE/i.test(normalizeForMatch(line))
    );

    if (labelIndex === -1) return undefined;

    for (let i = labelIndex + 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw) continue;

        const normalized = normalizeLine(raw);
        if (!normalized) continue;

        const upper = normalizeForMatch(normalized);

        // Skip other label lines (like Valabilitate)
        if (LABEL_KEYWORDS.test(upper)) continue;

        // Stop if we hit a validity date
        if (/\d{2}\.\d{2}\.\d{2,4}/.test(normalized)) break;

        return normalized;
    }

    return undefined;
}

function extractValidity(lines: string[]): string | undefined {
    const labelIndex = lines.findIndex(line =>
        /VALABIL|VALIDIT/i.test(normalizeForMatch(line))
    );

    if (labelIndex === -1) return undefined;

    for (let i = labelIndex + 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw) continue;

        const normalized = normalizeLine(raw);
        if (!normalized) continue;

        const upper = normalizeForMatch(normalized);

        // Stop if we hit another unrelated label block
        if (
            /CNP|SERIA|NUME|PRENUME|LOC\s*NAST|DOMICILIU/i.test(upper)
        ) {
            break;
        }

        // Match date range (17.01.17-06.05.2027)
        if (/\d{2}\.\d{2}\.\d{2,4}\s*-\s*\d{2}\.\d{2}\.\d{2,4}/.test(normalized)) {
            return normalized;
        }
    }

    return undefined;
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

    const {serie, number} = extractSerieAndNumber(joined);
    if (serie) client.serie = serie;
    if (number) client.number = number;

    const {first_name, last_name} = extractNames(rawLines);
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