const User = require("../models/user");
const NotFoundError = require("../errors/notFoundError");

const getUsers = (params) => {
  return User.find(params);
};

const getUser = (id) => {
  return User.findById(id);
};

const registerUser = (user) => {
  return User.create(user);
};

const updateUser = async (userId, userPayload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  for (const [field, value] of Object.entries(userPayload)) {
    if (user[field]) {
      user[field] = value;
    }
  }

  await user.save();
};

const archiveUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  user.isDeleted = true;

  await user.save();
};

module.exports = {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  archiveUser,
};
