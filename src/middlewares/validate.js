export const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (!!error) {
    return res.status(400).json({
      error: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
};
