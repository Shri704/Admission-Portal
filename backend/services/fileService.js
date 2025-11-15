// backend/services/fileService.js
import { uploadBuffer, deleteFile } from "../config/cloudinary.js";
import Document from "../models/Document.js";

/**
 * Upload a file to Cloudinary and store metadata in MongoDB
 */
export const uploadStudentDocument = async (studentId, buffer, docType) => {
  const uploadRes = await uploadBuffer(buffer, {
    folder: "student_documents",
  });

  const doc = await Document.findOneAndUpdate(
    { studentId, docType },
    {
      studentId,
      docType,
      fileUrl: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    },
    { upsert: true, new: true }
  );

  return doc;
};

/**
 * Delete document from Cloudinary and MongoDB
 */
export const deleteStudentDocument = async (docId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");
  await deleteFile(doc.publicId);
  await doc.deleteOne();
  return { success: true };
};
