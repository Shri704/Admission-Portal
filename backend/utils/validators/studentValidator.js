// backend/utils/validators/studentValidator.js
import Joi from "joi";

export const registerStudentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  branch: Joi.string().valid("CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT").required(),
  year: Joi.number().integer().min(1).max(4).required(),
  category: Joi.string()
    .valid("CET", "COMEDK", "SNQ", "MANAGEMENT", "SC", "ST")
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  photoUrl: Joi.string().uri(),
});
