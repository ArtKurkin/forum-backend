const { Forum, Topic } = require("../models/models");

const getForumById = async id => {
  const forum = await Forum.findByPk(id);
  return forum?.toJSON();
};

const getAllForums = async () => {
  const forumsDb = await Forum.findAll();
  const forums = forumsDb?.map(item => {
    return item.toJSON();
  });
  return forums;
};

const getForumBySlug = async slug => {
  const forum = await Forum.findOne({
    where: { slug: slug },
  });

  return forum?.toJSON();
};

const getForumByTitle = async title => {
  const forum = await Forum.findOne({
    where: { title: title },
  });

  return forum?.toJSON();
};

const getForumsByCategoryId = async id => {
  const forumsDb = await Forum.findAll({
    where: { categoryId: id },
    include: {
      model: Topic,
      attributes: ["title", "slug"],
    },
  });

  const forums = forumsDb?.map(item => {
    return item.toJSON();
  });
  return forums;
};

const createForum = async dto => {
  const newForum = await Forum.create(dto);
  return newForum?.toJSON();
};

module.exports = {
  getForumById,
  getAllForums,
  getForumBySlug,
  getForumByTitle,
  getForumsByCategoryId,
  createForum,
};
