// backend/utils/validators/feeValidator.js
import Joi from "joi";

export const feeSchema = Joi.object({
  year: Joi.number().integer().min(1).max(4).required(),
  branch: Joi.string().valid("CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT").required(),
  type: Joi.string().valid("Academic", "Exam", "Backlog", "Other").required(),
  description: Joi.string().allow("", null),
  amount: Joi.number().min(0).required(),
});
