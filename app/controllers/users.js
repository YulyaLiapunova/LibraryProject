const usersService = require("../services/users");

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers(req.params);
    res.send(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await usersService.getUser(req.params.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const user = await usersService.registerUser(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    await usersService.updateUser(req.params.id, req.body);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const archiveUser = async (req, res, next) => {
  try {
    await usersService.archiveUser(req.params.id);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  archiveUser,
};
