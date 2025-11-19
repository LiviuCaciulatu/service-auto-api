import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error-middleware";
import clientController from "./controllers/client-controller";
import uploadRouter from "./controllers/upload-controller"

dotenv.config();

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Service Auto API is running"});
    });

app.use("/clients", clientController);
app.use("/upload", uploadRouter);

app.use(errorMiddleware);

const PORT = process.env.port || 3000;

app.listen(PORT, ()=>{
console.log(`Server running on http://localhost:${PORT}`);
});
