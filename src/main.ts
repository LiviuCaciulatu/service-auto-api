import "@/config/env";

import express from "express";
import cors from "cors";

import {authenticateRequest} from "@/config/auth-middleware";
import clientController from "@/entities/client/controllers/client-controller";
import fileUploadController from "@/entities/file-upload/controllers/file-upload-controller";
import carDocumentController from "@/entities/car-document/controllers/car-document-controller";
import driverLicenseController from "@/entities/driver-license/controllers/driver-license-controller"
import {errorMiddleware} from "@/config/error-middleware";
import authController from "@/entities/auth/controllers/auth-controller";
import userController from "@/entities/auth/controllers/user-controller";
import compensationClaimController from "@/entities/compensation-claim/controllers/compensation-claim-controller";
import contractCesiuneCreantaController from "@/entities/contract-cesiune-creanta/controllers/contract-cesiune-creanta-controller";
import contractInlocuireTemporaraController from "@/entities/contract-inlocuire-temporara/controllers/contract-inlocuire-temporara-controller";
import contractReparatiiAutoController from "@/entities/contract-reparatii-auto/controllers/contract-reparatii-auto-controller";
import avizareAllianzTiriacController from "@/entities/templates/avizare-allianz-tiriac/controllers/avizare-allianz-tiriac-controller";
import avizareAsiromController from "@/entities/templates/avizare-asirom/controllers/avizare-asirom-controller";
import avizareAxeriaController from "@/entities/templates/avizare-axeria/controllers/avizare-axeria-controller";
import avizareDallbogController from "@/entities/templates/avizare-dallbog/controllers/avizare-dallbog-controller";
import avizareEazyController from "@/entities/templates/avizare-eazy/controllers/avizare-eazy-controller";
import avizareOmniasigController from "@/entities/templates/avizare-omniasig/controllers/avizare-omniasig-controller";
import avizareGeneraliController from "@/entities/templates/avizare-generali/controllers/avizare-generali-controller";
import avizareGraweController from "@/entities/templates/avizare-grawe/controllers/avizare-grawe-controller";
import avizareGroupamaController from "@/entities/templates/avizare-groupama/controllers/avizare-groupama-controller";
import avizareHellasDirectController from "@/entities/templates/avizare-hellas-direct/controllers/avizare-hellas-direct-controller";
import contractMandatController from "@/entities/templates/contract-mandat/controllers/contract-mandat-controller";
import imputernicireController from "@/entities/templates/imputernicire/controllers/imputernicire-controller";
import gdprAsiromController from "@/entities/templates/gdpr-asirom/controllers/gdpr-asirom-controller";
import gdprAxeriaController from "@/entities/templates/gdpr-axeria/controllers/gdpr-axeria-controller";
import gdprGeneraliController from "@/entities/templates/gdpr-generali/controllers/gdpr-generali-controller";
import gdprGraweController from "@/entities/templates/gdpr-grawe/controllers/gdpr-grawe-controller";
import gdprGroupamaController from "@/entities/templates/gdpr-groupama/controllers/gdpr-groupama-controller";
import gdprHellasDirectController from "@/entities/templates/gdpr-hellas-direct/controllers/gdpr-hellas-direct-controller";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://www.service-app.cleancodeit.com"
];

const protectedRoutes = [
    "/auth/validate",
    "/auth/social/link",
    "/users",
    "/clients",
    "/files",
    "/driverLicenses",
    "/carDocuments",
    "/compensationClaims",
    "/contractCesiuneCreanta",
    "/contractInlocuireTemporara",
    "/contractReparatiiAuto",
    "/avizareAllianzTiriac",
    "/avizareAsirom",
    "/avizareOmniasig",
    "/avizareGenerali",
    "/avizareGrawe",
    "/avizareAxeria",
    "/avizareDallbog",
    "/avizareEazy",
    "/avizareGroupama",
    "/avizareHellasDirect",
    "/contractMandat",
    "/imputernicire",
    "/gdprAsirom",
    "/gdprAxeria",
    "/gdprGenerali",
    "/gdprGrawe",
    "/gdprGroupama",
    "/gdprHellasDirect"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
    credentials: true
}));

app.options("/files/upload", cors({
    origin: allowedOrigins,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "UP" });
});

app.use(protectedRoutes, authenticateRequest);

app.use("/auth", authController);
app.use("/users", userController);
app.use("/clients", clientController);
app.use("/files", fileUploadController);
app.use("/driverLicenses", driverLicenseController);
app.use("/carDocuments", carDocumentController);
app.use("/compensationClaims", compensationClaimController);
app.use("/contractCesiuneCreanta", contractCesiuneCreantaController);
app.use('/contractInlocuireTemporara', contractInlocuireTemporaraController);
app.use('/contractReparatiiAuto', contractReparatiiAutoController);
app.use('/avizareAllianzTiriac', avizareAllianzTiriacController);
app.use("/avizareAsirom", avizareAsiromController);
app.use("/avizareOmniasig", avizareOmniasigController);
app.use("/avizareGenerali", avizareGeneraliController);
app.use("/avizareGrawe", avizareGraweController);
app.use("/avizareAxeria", avizareAxeriaController);
app.use("/avizareDallbog", avizareDallbogController);
app.use("/avizareEazy", avizareEazyController);
app.use("/avizareGroupama", avizareGroupamaController);
app.use("/avizareHellasDirect", avizareHellasDirectController);
app.use("/contractMandat", contractMandatController);
app.use("/imputernicire", imputernicireController);
app.use("/gdprAsirom", gdprAsiromController);
app.use("/gdprAxeria", gdprAxeriaController);
app.use("/gdprGenerali", gdprGeneraliController);
app.use("/gdprGrawe", gdprGraweController);
app.use("/gdprGroupama", gdprGroupamaController);
app.use("/gdprHellasDirect", gdprHellasDirectController);

app.use((_req, res)=>{
    res.status(404).json({message: "not found", code: 404})
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
