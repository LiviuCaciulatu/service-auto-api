import { Router } from "express";
import path from "path";

const router = Router();

router.post("/upload-file", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(req.file.path).toLowerCase();

    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      return res.status(200).json({ message: "Image file uploaded successfully" });
    } else if (ext === ".pdf") {
      return res.status(200).json({ message: "PDF uploaded successfully" });
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }
  } catch (err) {
    next(err);
  }
});

export default router;