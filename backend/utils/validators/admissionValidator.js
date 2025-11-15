// backend/utils/validators/admissionValidator.js
import Joi from "joi";

export const admissionApplySchema = Joi.object({
  year: Joi.number().integer().min(1).max(4).required(),
  branch: Joi.string()
    .valid("CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT")
    .required(),
  documents: Joi.array().items(Joi.string().hex().length(24)).required(),
});
