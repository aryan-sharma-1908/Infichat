import cloudinary from "../config/CloudinaryConfig.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No file uploaded. Please provide a file with field name 'file'",
      });
    }

    const filePath = req.file.path;
    const uploadResult = await cloudinary.uploader.upload(filePath);

    // Delete the file from local storage after successful upload
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file: ", err);
    });

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("File upload error: ", error);

    // Delete the file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err)
          console.error(
            "Error deleting local file after upload failure: ",
            err,
          );
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during file upload",
    });
  }
};
