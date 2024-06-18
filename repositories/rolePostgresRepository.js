const { Role } = require("../models/models");

const getRoleById = async id => {
  const role = await Role.findByPk(id);
  return role?.toJSON();
};

module.exports = {
  getRoleById,
};
