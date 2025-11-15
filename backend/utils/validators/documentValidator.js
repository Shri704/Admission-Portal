// backend/utils/validators/documentValidator.js
import Joi from "joi";

export const uploadDocumentSchema = Joi.object({
  docType: Joi.string()
    .valid(
      "Aadhaar",
      "Photo",
      "10th Marksheet",
      "12th Marksheet",
      "PreviousSemResult",
      "Bonafide",
      "Others"
    )
    .required(),
});
