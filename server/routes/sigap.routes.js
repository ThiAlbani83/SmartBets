import express from "express";
import multer from "multer";
import { uploadFile, listFiles } from "../controllers/sigap.controller.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/list_files", listFiles);

export default router;
