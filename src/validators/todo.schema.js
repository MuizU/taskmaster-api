import Joi from "joi";

const titleValidation = Joi.string()
  .trim()
  .min(3)
  .max(20)
  .pattern(/^(?=.*[A-Za-z])[A-Za-z0-9 '\-]+$/)
  .messages({
    "string.pattern.base":
      "Title must contain at least one letter and only letters, numbers, spaces, apostrophes, or hyphens.",
  });

const completedValidation = Joi.bool().default(false).optional();

export const createSchema = Joi.object({
  title: titleValidation.required(),
  completed: completedValidation,
});

export const updateSchema = Joi.object({
  title: titleValidation.optional(),
  completed: completedValidation,
}).min(1);
