const Joi = require("joi");

exports.postValidation = data => {
  const schema = Joi.object({
    content: Joi.string().min(2).max(255).required().messages({
      "string.base": "Текст должен быть строкой",
      "string.epmty": "Текст не должен быть пустым",
      "string.min": "Минимальная длинна Текста 2 символа",
      "string.max": "Максимальная длинна Текста 255 символа",
      "any.required": "Текст обязательное поле",
    }),
    topicId: Joi.number().required(),
    userId: Joi.number().required(),
  });
  return schema.validate(data);
};
