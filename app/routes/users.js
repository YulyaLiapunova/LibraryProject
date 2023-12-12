const router = require("express").Router();
const { param, query } = require("express-validator");
const {
  registerUserValidator,
  updateUserValidator,
} = require("../schemas/users");
const validationHandler = require("../middlewares/validationHandler");
const errorHandler = require("../middlewares/errorHandler");
const usersController = require("../controllers/users");

router.get(
  "/",
  query("limit").default(10),
  query("offset").default(0),
  validationHandler,
  usersController.getUsers,
  errorHandler
);
router.get(
  "/:id",
  param("id").isMongoId(),
  validationHandler,
  usersController.getUser,
  errorHandler
);

router.post(
  "/register",
  ...registerUserValidator,
  validationHandler,
  usersController.registerUser,
  errorHandler
);
router.post(
  "/:id",
  param("id").isMongoId(),
  ...updateUserValidator,
  validationHandler,
  usersController.updateUser,
  errorHandler
);

router.put(
  "/:id",
  param("id").isMongoId(),
  validationHandler,
  usersController.archiveUser,
  errorHandler
);

module.exports = router;
