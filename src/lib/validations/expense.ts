import Joi from "joi";

export const expenseValidationSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(0).max(200).optional(),
  amount: Joi.number().positive().required(),
  date: Joi.date().required(),
  members: Joi.array().items(Joi.string()).required(),
});
