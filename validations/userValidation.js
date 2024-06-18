const Joi = require("joi");

exports.userValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      "string.base": "Имя должено быть строкой",
      "string.epmty": "Имя не должено быть пустым",
      "string.min": "Минимальная длинна Имени 2 символа",
      "string.max": "Максимальная длинна Имени 255 символа",
      "any.required": "Имя обязательное поле",
    }),
    password: Joi.string().min(2).max(255).required().messages({
      "string.base": "Пароль должен быть строкой",
      "string.epmty": "Пароль не должен быть пустым",
      "string.min": "Минимальная длинна Пароля 2 символа",
      "string.max": "Максимальная длинна Пароля 255 символа",
      "any.required": "Пароль обязательное поле",
    }),
  });
  return schema.validate(data);
};
