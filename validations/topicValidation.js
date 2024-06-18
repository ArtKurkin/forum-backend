const Joi = require("joi");
const userService = require("../services/userService");

exports.topicValidation = data => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required().messages({
      "string.base": "Заголовок должен быть строкой",
      "string.epmty": "Заголовок не должен быть пустым",
      "string.min": "Минимальная длинна Заголовка 2 символа",
      "string.max": "Максимальная длинна Заголовка 255 символа",
      "any.required": "Заголовок обязательное поле",
    }),
    content: Joi.string().min(2).max(255).required().messages({
      "string.base": "Текст должен быть строкой",
      "string.epmty": "Текст не должен быть пустым",
      "string.min": "Минимальная длинна Текста 2 символа",
      "string.max": "Максимальная длинна Текста 255 символа",
      "any.required": "Текст обязательное поле",
    }),
    forumId: Joi.number().required(),
    userId: Joi.number().required(),
  });
  return schema.validate(data);
};
