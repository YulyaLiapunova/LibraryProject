const { body } = require("express-validator");

const registerUserValidator = [
  body("firstName", "Поле `Имя` обязательно для заполнения")
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Имя`"),
  body("lastName", "Поле `Фамилия` обязательно для заполнения")
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Фамилия`"),
  body("email", "Поле `Email` обязательно для заполнения")
    .notEmpty()
    .isEmail()
    .withMessage("Неверное значение для поля `Email`"),
  body("memberSince")
    .optional()
    .isDate()
    .withMessage("Неверное значение для поля `Дата регистрации`"),
];

const updateUserValidator = [
  body("firstName")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Имя`"),
  body("lastName")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Фамилия`"),
  body("email")
    .optional()
    .notEmpty()
    .isEmail()
    .withMessage("Неверное значение для поля `Email`"),
  body("memberSince")
    .optional()
    .isDate()
    .withMessage("Неверное значение для поля `Дата регистрации`"),
];

module.exports = {
  registerUserValidator,
  updateUserValidator,
};
