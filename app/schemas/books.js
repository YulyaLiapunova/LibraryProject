const { body } = require("express-validator");
const { raiting, genreList } = require("../const");

const createBookValidator = [
  body("name", "Поле `Название` обязательно для заполнения")
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Название`"),
  body("authors", "Поле `Авторы` обязательно для заполнения")
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Авторы`"),
  body("isbn", "Поле `isbn` обязательно для заполнения")
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `isbn`"),
  body("genre", "Поле `Жанр` обязательно для заполнения")
    .notEmpty()
    .isIn(genreList)
    .withMessage(`Жанр должен быть из списка: ${genreList.join(", ")}`),
  body("year", "Поле `Год` обязательно для заполнения")
    .notEmpty()
    .isInt({ min: 1800 })
    .withMessage("Неверное значение для поля `Год`"),
  body("rating", "Поле `Рейтинг` обязательно для заполнения")
    .notEmpty()
    .isIn(raiting)
    .withMessage(`Рейтинг должен быть из списка: ${raiting.join(", ")}`),
];

const updateBookValidator = [
  body("name")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Название`"),
  body("authors")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Авторы`"),
  body("isbn")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Неверное значение для поля `Авторы`"),
  body("genre")
    .optional()
    .notEmpty()
    .isIn(genreList)
    .withMessage(`Жанр должен быть из списка: ${genreList.join(", ")}`),
  body("year")
    .optional()
    .notEmpty()
    .isInt({ min: 1800 })
    .withMessage("Неверное значение для поля `Год`"),
  body("rating")
    .optional()
    .notEmpty()
    .isIn(raiting)
    .withMessage(`Рейтинг должен быть из списка: ${raiting.join(", ")}`),
];

module.exports = {
  createBookValidator,
  updateBookValidator,
};
