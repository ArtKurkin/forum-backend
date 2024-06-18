const Joi = require("joi");

exports.userAuthValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    id: Joi.number().required(),
  });
  return schema.validate(data);
};
