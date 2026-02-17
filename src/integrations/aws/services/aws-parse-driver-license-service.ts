import * as driverLicenseTypes from "@/entities/driver-license/types";
import {
    extractAfterLabel,
    normalizeForMatch,
    normalizeLine,
    parseDate
} from "@/integrations/aws/services/aws-text-extract-service";


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

    // Match date with optional space before year
    const dateRegex = /\b(\d{2}[./]\d{2}[./]\s*\d{4})\b/;
    const dateMatch = content.match(dateRegex);

    let date: string | undefined;
    if (dateMatch && dateMatch[1]) {
        date = parseDate(dateMatch[1].replace(/\s+/g, "")); // remove extra space for parseDate
    }

    // Remove the matched date from content to get birthplace
    const birthPlace = dateMatch && dateMatch[0]
        ? content.replace(dateMatch[0], "").trim()
        : content.trim();

    const result: {
        date_of_birth?: string;
        birth_place?: string;
    } = {};

    if (date) result.date_of_birth = date;
    if (birthPlace) result.birth_place = birthPlace;

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

