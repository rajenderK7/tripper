import Joi from "joi";

export const invitationValidationSchema = Joi.object({
  id: Joi.string().optional(), // Optional field
  trip_id: Joi.string().required().messages({
    "string.empty": "Trip ID is required.",
    "any.required": "Trip ID is required.",
  }),
  invitee: Joi.string().required().messages({
    "string.empty": "Invitee username is required.",
    "any.required": "Invitee username is required.",
  }),
  invited_by: Joi.string().required().messages({
    "string.empty": "Invited By is required.",
    "any.required": "Invited By is required.",
  }),
});

export const invitationActionValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Invitation ID is required.",
  }),
  trip_id: Joi.string().required().messages({
    "any.required": "Trip ID is required.",
  }),
  accept: Joi.boolean().required().messages({
    "any.required": "Action (accept) is required.",
  }),
});
