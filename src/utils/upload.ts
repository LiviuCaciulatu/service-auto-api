import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()* 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

function fileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)){
    cb(null, true);
    } else {
    cb(new Error("Unsupported file type"));
    }
}

const upload = multer({ storage, fileFilter });

export default upload;