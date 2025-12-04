import "@/config/env";
import express from "express";
import clientController from "@/entities/client/controllers/client-controller";
import fileUploadController from "@/entities/file-upload/controllers/file-upload-controller";
import {errorMiddleware} from "@/config/error-middleware";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({status: "ok", message: "Service Auto API is running"});
});

app.use("/clients", clientController);
app.use("/files", fileUploadController);

app.use((req, res)=>{
    res.status(404).json({message: "not found", code: 404})
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
