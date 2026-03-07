import { Router } from "express";
import upload from "../middlewares/MulterMiddleware.js";
import { uploadImage } from "../controllers/UploadControllers.js";

const router = Router();

// Wrapper to catch async errors and Multer errors
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message || "image upload error",
      });
    }
    if (!req.file) {
      console.error("No image found in request after Multer processing");
      return res.status(400).json({
        success: false,
        message:
          "No file provided. Make sure to send a file with field name 'image'",
      });
    }
    console.log("image uploaded:", req.file.filename);
    next();
  });
};

router.post("/image", handleUpload, uploadImage);

export default router;
