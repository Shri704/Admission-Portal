// backend/config/cloudinary.js
// Cloudinary v2 configuration & helper wrapper functions.
// Provides: uploadFile(filePath, options), uploadBuffer(buffer, options), deleteFile(publicId)
// Falls back to local file storage in development mode if Cloudinary is not configured

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import config from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local uploads directory
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "documents");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }
}

// Check if Cloudinary is configured (and not using test values)
const isCloudinaryConfigured = 
  config.cloudinary.cloudName && 
  config.cloudinary.cloudName !== "test_cloud" &&
  config.cloudinary.apiKey && 
  config.cloudinary.apiSecret;

if (isCloudinaryConfigured) {
  try {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true,
    });
    console.log("✅ Cloudinary configured");
  } catch (err) {
    console.warn("⚠️ Cloudinary configuration error:", err.message);
  }
} else {
  console.warn("⚠️ Cloudinary not configured. Using local file storage for development.");
  ensureUploadsDir();
}

/**
 * Upload a file from a local path or a temporary multer path.
 * @param {string} filePath - Local path to file (or remote URL accepted by Cloudinary)
 * @param {Object} options - Cloudinary upload options (folder, public_id, resource_type)
 * @returns {Promise<Object>} - result (secure_url, public_id, width, height, format etc.)
 */
export function uploadFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: options.folder || "engg_admissions",
        resource_type: options.resource_type || "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

/**
 * Upload a buffer (useful when you receive file as stream/buffer, e.g., from multer memoryStorage)
 * Falls back to local storage if Cloudinary is not configured
 * @param {Buffer} buffer
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function uploadBuffer(buffer, options = {}) {
  if (!isCloudinaryConfigured) {
    // Fallback to local file storage
    return uploadBufferLocal(buffer, options);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "engg_admissions",
        resource_type: options.resource_type || "auto",
        use_filename: true,
        unique_filename: true,
        ...options,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/**
 * Local file storage fallback for development
 * @param {Buffer} buffer
 * @param {Object} options - May include mimetype or format
 * @returns {Promise<Object>}
 */
async function uploadBufferLocal(buffer, options = {}) {
  await ensureUploadsDir();
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const folder = options.folder || "student_documents";
  const folderPath = path.join(UPLOADS_DIR, folder);
  
  // Ensure folder exists
  await fs.mkdir(folderPath, { recursive: true });
  
  // Determine file extension from mimetype, format, or buffer signature
  let ext = ".bin";
  if (options.mimetype) {
    if (options.mimetype === "image/jpeg" || options.mimetype === "image/jpg") ext = ".jpg";
    else if (options.mimetype === "image/png") ext = ".png";
    else if (options.mimetype === "application/pdf") ext = ".pdf";
  } else if (options.format) {
    ext = `.${options.format}`;
  } else {
    // Detect from buffer signature
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) ext = ".jpg";
    else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) ext = ".png";
    else if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) ext = ".pdf";
  }
  
  const filename = `${timestamp}_${randomStr}${ext}`;
  const filePath = path.join(folderPath, filename);
  
  // Write file
  await fs.writeFile(filePath, buffer);
  
  // Return Cloudinary-like response format
  const publicId = `${folder}/${timestamp}_${randomStr}`;
  const baseUrl = config.clientUrl || "http://localhost:5000";
  const secureUrl = `${baseUrl}/uploads/documents/${folder}/${filename}`;
  
  return {
    secure_url: secureUrl,
    public_id: publicId,
    format: ext.substring(1),
    resource_type: ext === ".pdf" ? "raw" : "image",
    width: null,
    height: null,
  };
}

/**
 * Delete a file by its public id
 * Handles both Cloudinary and local file storage
 * @param {string} publicId
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function deleteFile(publicId, options = {}) {
  if (!isCloudinaryConfigured) {
    // Delete from local storage
    return deleteFileLocal(publicId);
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/**
 * Delete file from local storage
 * @param {string} publicId - Format: "folder/timestamp_random"
 * @returns {Promise<Object>}
 */
async function deleteFileLocal(publicId) {
  try {
    // publicId format: "folder/timestamp_random"
    // We need to find the actual file with extension
    const parts = publicId.split("/");
    const folder = parts[0] || "student_documents";
    const filenamePrefix = parts[1];
    
    const folderPath = path.join(UPLOADS_DIR, folder);
    
    try {
      const files = await fs.readdir(folderPath);
      const fileToDelete = files.find(f => f.startsWith(filenamePrefix));
      
      if (fileToDelete) {
        const filePath = path.join(folderPath, fileToDelete);
        await fs.unlink(filePath);
        return { result: "ok" };
      }
    } catch (err) {
      // File or folder doesn't exist, that's okay
      return { result: "ok" };
    }
    
    return { result: "ok" };
  } catch (err) {
    // Don't fail if deletion fails
    console.warn("Failed to delete local file:", err.message);
    return { result: "ok" };
  }
}

export default {
  uploadFile,
  uploadBuffer,
  deleteFile,
  cloudinary, // export raw for advanced usage
};
