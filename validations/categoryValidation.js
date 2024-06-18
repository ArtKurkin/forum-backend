const Joi = require("joi");

exports.categoryValidation = data => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(data);
};
