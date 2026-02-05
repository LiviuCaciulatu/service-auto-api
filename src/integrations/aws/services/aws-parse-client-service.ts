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