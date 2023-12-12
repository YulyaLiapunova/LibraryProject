const router = require("express").Router();
const { param, query } = require("express-validator");
const {
  createBookValidator,
  updateBookValidator,
} = require("../schemas/books");
const validationHandler = require("../middlewares/validationHandler");
const errorHandler = require("../middlewares/errorHandler");
const booksController = require("../controllers/books");

router.get(
  "/",
  query("limit").default(10),
  query("offset").default(0),
  validationHandler,
  booksController.getBooks,
  errorHandler
);
router.get(
  "/overdue",
  query("limit").default(10),
  query("offset").default(0),
  validationHandler,
  booksController.getOverdueBooks,
  errorHandler
);
router.get(
  "/:id",
  param("id").isMongoId(),
  validationHandler,
  booksController.getBook,
  errorHandler
);
router.get(
  "/:id/history",
  param("id").isMongoId(),
  validationHandler,
  booksController.getBookHistory,
  errorHandler
);

router.post(
  "/",
  ...createBookValidator,
  validationHandler,
  booksController.addBook,
  errorHandler
);
router.post(
  "/:id",
  param("id").isMongoId(),
  ...updateBookValidator,
  validationHandler,
  booksController.updateBook,
  errorHandler
);

router.put(
  "/:id",
  param("id").isMongoId(),
  validationHandler,
  booksController.archiveBook,
  errorHandler
);
router.put(
  "/:id/borrow/:userId",
  param("id").isMongoId(),
  param("userId").isMongoId(),
  validationHandler,
  booksController.borrowBook,
  errorHandler
);
router.put(
  "/:id/return",
  param("id").isMongoId(),
  validationHandler,
  booksController.returnBook,
  errorHandler
);

module.exports = router;
