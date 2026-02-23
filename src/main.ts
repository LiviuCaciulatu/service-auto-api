import "@/config/env";

import express from "express";
import cors from "cors";

import clientController from "@/entities/client/controllers/client-controller";
import fileUploadController from "@/entities/file-upload/controllers/file-upload-controller";
import carDocumentController from "@/entities/car-document/controllers/car-document-controller";
import driverLicenseController from "@/entities/driver-license/controllers/driver-license-controller"
import {errorMiddleware} from "@/config/error-middleware";
import compensationClaimController from "@/entities/compensation-claim/controllers/compensation-claim-controller";


const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173/",
        "https://d8hj2mro67a3b.cloudfront.net"
    ],
    credentials: true
}));

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "UP" });
});

app.use("/clients", clientController);
app.use("/files", fileUploadController);
app.use("/carDocuments", carDocumentController);
app.use("/driverLicenses", driverLicenseController);
app.use("/compensationClaims", compensationClaimController);

app.use((_req, res)=>{
    res.status(404).json({message: "not found", code: 404})
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
