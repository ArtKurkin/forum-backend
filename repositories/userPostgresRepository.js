const { User } = require("../models/models");

const getUserBySlug = async slug => {
  const user = await User.findOne({ where: { slug: slug } });
  return user?.toJSON();
};

const getUserByName = async name => {
  const user = await User.findOne({ where: { name: name } });
  return user?.toJSON();
};

const getUserById = async id => {
  const user = await User.findByPk(id);
  return user?.toJSON();
};

const createUser = async dto => {
  const newUser = await User.create(dto);
  return newUser?.toJSON();
};

const deleteUserById = async id => {
  await User.destroy({
    where: {
      id: id,
    },
  });
};

const saveRefreshTokenByUserId = async (id, refreshToken) => {
  const tokenData = await User.findByPk(id);
  if (!tokenData) return;
  tokenData.refreshToken = refreshToken;
  await tokenData.save();
  return tokenData?.toJSON();
};

const deleteRefreshToken = async refreshToken => {
  const tokenData = await User.findOne({
    where: { refreshToken: refreshToken },
  });
  if (tokenData) {
    tokenData.refreshToken = null;
    await tokenData.save();
  }

  return tokenData?.toJSON();
};

const getUsersRefreshToken = async refreshToken => {
  const tokenData = await User.findOne({
    where: { refreshToken: refreshToken },
  });
  return tokenData?.toJSON();
};

module.exports = {
  getUserBySlug,
  getUserByName,
  getUserById,
  createUser,
  deleteUserById,
  saveRefreshTokenByUserId,
  deleteRefreshToken,
  getUsersRefreshToken,
};
