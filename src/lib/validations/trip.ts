import Joi from "joi";

export const tripValidationSchema = Joi.object({
  id: Joi.string().optional(), // Optional ID as a string
  title: Joi.string()
    .min(3)
    .max(100)
    .required() // Title must be between 3 and 100 characters
    .messages({
      "string.base": "Title must be a string.",
      "string.empty": "Title cannot be empty.",
      "string.min": "Title must be at least 3 characters long.",
      "string.max": "Title cannot exceed 100 characters.",
      "any.required": "Title is required.",
    }),
  location: Joi.string()
    .min(3)
    .max(100)
    .required() // Location must be between 3 and 100 characters
    .messages({
      "string.empty": "Location cannot be empty.",
      "string.min": "Location must be at least 3 characters long.",
      "string.max": "Location cannot exceed 100 characters.",
      "any.required": "Location is required.",
    }),
  created_by: Joi.string().optional(), // Optional string
  start_date: Joi.date()
    .required() // Ensure start_date is a valid date
    .messages({
      "date.base": "Start date must be a valid date.",
      "any.required": "Start date is required.",
    }),
  planned_dates: Joi.string()
    .pattern(
      /^[A-Za-z]+\s\d{1,2}-\d{1,2},\s\d{4}$/ // Matches "Month Day-Day, Year"
    )
    .required()
    .messages({
      "string.empty": "Planned dates cannot be empty.",
      "string.pattern.base":
        "Planned dates must be in the format 'Month Day-Day, Year'.",
      "any.required": "Planned dates are required.",
    }),
  members: Joi.array()
    .items(Joi.string())
    .optional() // Optional array of strings
    .messages({
      "array.base": "Members must be an array of strings.",
    }),
  invitees: Joi.array().items(Joi.string()).optional(), // Optional array of strings
});
