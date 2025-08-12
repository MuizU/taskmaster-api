import Joi from "joi";

export const createSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(20).required(),
  completed: Joi.bool().default(false).optional(),
});

export const updateSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(20).optional(),
  completed: Joi.bool().default(false).optional(),
});
