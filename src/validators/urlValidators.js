import Joi from "joi";

export const urlSchema = Joi.object({
  originalUrl: Joi.string().uri().required().messages({
    "string.empty": "Original URL is required",
    "string.uri": "Original URL must be a valid URI",
  }),
  shortUrl: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Short URL is required",
    "string.min": "Short URL must be at least 3 characters",
    "string.max": "Short URL cannot be longer than 20 characters",
  }),
});

