import "@/config/env";

import express from "express";
import cors from "cors";

import clientController from "@/entities/client/controllers/client-controller";
import fileUploadController from "@/entities/file-upload/controllers/file-upload-controller";
import carDocumentController from "@/entities/car-document/controllers/car-document-controller";
import driverLicenseController from "@/entities/driver-license/controllers/driver-license-controller"
import {errorMiddleware} from "@/config/error-middleware";
import compensationClaimController from "@/entities/compensation-claim/controllers/compensation-claim-controller";
import contractCesiuneCreantaController from "@/entities/contract-cesiune-creanta/controllers/contract-cesiune-creanta-controller";
import contractInlocuireTemporaraController from "@/entities/contract-inlocuire-temporara/controllers/contract-inlocuire-temporara-controller";
import contractReparatiiAutoController from "@/entities/contract-reparatii-auto/controllers/contract-reparatii-auto-controller";


const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://www.service-app.cleancodeit.com"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
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

app.use("/clients", clientController);
app.use("/files", fileUploadController);
app.use("/driverLicenses", driverLicenseController);
app.use("/carDocuments", carDocumentController);
app.use("/compensationClaims", compensationClaimController);
app.use("/contractCesiuneCreanta", contractCesiuneCreantaController);
app.use('/contractInlocuireTemporara', contractInlocuireTemporaraController);
app.use('/contractReparatiiAuto', contractReparatiiAutoController);

app.use((_req, res)=>{
    res.status(404).json({message: "not found", code: 404})
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
