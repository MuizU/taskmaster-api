export const validate = (schema) => (req, res, next) => {
  try {
    const { value, error } = schema.validate(req.body);
    if (!!error) {
      throw new Error(error.details);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.errors || error.message,
    });
  }
};
