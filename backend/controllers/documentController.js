// backend/controllers/documentController.js
import asyncHandler from "express-async-handler";
import Document from "../models/Document.js";
import Student from "../models/Student.js";
import { uploadBuffer, deleteFile } from "../config/cloudinary.js";
import { DOCUMENT_TYPE_VALUES } from "../utils/constants.js";
import { logError } from "../services/loggerService.js";

/**
 * @desc Upload student document
 * @route POST /api/documents/upload
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  const { docType } = req.body;

  // Ensure user is authenticated and is a student
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Authentication required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("File missing in request");
  }

  const normalizedType = docType?.trim();
  if (!normalizedType || !DOCUMENT_TYPE_VALUES.includes(normalizedType)) {
    res.status(400);
    throw new Error("Invalid document type provided.");
  }

  // Check if document of this type already exists for THIS student only
  const existingDoc = await Document.findOne({
    studentId: req.user._id, // Always use authenticated user's ID
    docType: normalizedType,
  });

  // Upload new file to Cloudinary (or local storage fallback)
  let result;
  try {
    result = await uploadBuffer(req.file.buffer, {
    folder: "student_documents",
      mimetype: req.file.mimetype, // Pass mimetype for local storage
    });
  } catch (uploadError) {
    logError("Cloudinary upload failed", uploadError);
    res.status(500);
    throw new Error(
      uploadError.message?.includes("Invalid API") || uploadError.message?.includes("Must supply")
        ? "Cloudinary configuration error. Please check your Cloudinary credentials in .env file."
        : `Failed to upload file: ${uploadError.message || "Unknown error"}`
    );
  }

  if (!result || !result.secure_url || !result.public_id) {
    logError("Invalid Cloudinary response", { result });
    res.status(500);
    throw new Error("Invalid response from file upload service.");
  }

  let document;
  let isUpdate = false;
  
  try {
    if (existingDoc) {
      isUpdate = true;
      // Delete old file from Cloudinary if it exists
      if (existingDoc.publicId) {
        try {
          await deleteFile(existingDoc.publicId);
        } catch (err) {
          // Log but don't fail if deletion fails
          logError("Failed to delete old file from Cloudinary", err);
        }
      }

      // Update existing document
      existingDoc.fileUrl = result.secure_url;
      existingDoc.publicId = result.public_id;
      existingDoc.verified = false; // Reset verification status on update
      await existingDoc.save();
      document = existingDoc;
    } else {
      // Create new document - ensure it's associated with the correct student
      document = await Document.create({
    studentId: req.user._id,
    docType: normalizedType,
    fileUrl: result.secure_url,
    publicId: result.public_id,
  });

      // Add document reference to student's documents array
      await Student.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { documents: document._id } },
        { new: true }
      );
    }

    // Update student photo if this is a photo upload
  if (normalizedType === "Photo") {
    await Student.findByIdAndUpdate(req.user._id, { photoUrl: result.secure_url });
    }
  } catch (dbError) {
    logError("Database error during document save", dbError);
    // If document was created but student update failed, try to clean up
    if (document && !isUpdate) {
      try {
        await Document.findByIdAndDelete(document._id);
        await deleteFile(result.public_id);
      } catch (cleanupError) {
        logError("Failed to cleanup document after error", cleanupError);
      }
    }
    res.status(500);
    throw new Error(`Failed to save document: ${dbError.message || "Database error"}`);
  }

  res.status(201).json({
    success: true,
    message: isUpdate ? "Document updated successfully" : "Document uploaded successfully",
    data: document,
  });
});

/**
 * @desc Delete a document
 * @route DELETE /api/documents/:id
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }

  const isOwner = doc.studentId?.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isOwner) {
    res.status(403);
    throw new Error("You are not authorized to delete this document.");
  }

  // Store studentId before deletion for cleanup
  const studentId = doc.studentId;

  // Delete file from Cloudinary
  await deleteFile(doc.publicId);
  
  // Remove document reference from student's documents array
  await Student.findByIdAndUpdate(
    studentId,
    { $pull: { documents: doc._id } },
    { new: true }
  );

  // Delete document from database
  await doc.deleteOne();

  // Clear photo URL if this was a photo document
  if (doc.docType === "Photo") {
    await Student.findByIdAndUpdate(studentId, { photoUrl: null });
  }

  res.json({ success: true, message: "Document deleted" });
});
