import "@/config/env";
import express from "express";
import clientController from "@/entities/client/controllers/client-controller";
import fileUploadController from "@/entities/file-upload/controllers/file-upload-controller";
import carDocumentController from "@/entities/car-document/controllers/car-document-controller";
import driverLicenseController from "@/entities/driver-license/controllers/driver-license-controller"
import {errorMiddleware} from "@/config/error-middleware";
import compensationClaimController from "@/entities/compensation-claim/controllers/compensation-claim-controller";
declare module "pdfjs-dist/legacy/build/pdf";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({status: "ok", message: "Service Auto API is running"});
});

app.use("/clients", clientController);
app.use("/files", fileUploadController);
app.use("/carDocuments", carDocumentController);
app.use("/driverLicenses", driverLicenseController);
app.use("/compensationClaims", compensationClaimController);

app.use((req, res)=>{
    res.status(404).json({message: "not found", code: 404})
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});