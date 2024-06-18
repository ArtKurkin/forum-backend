const { Topic, Post } = require("../models/models");

const getAllTopicsByForumId = async id => {
  const topicsDb = await Topic.findAll({
    where: { forumId: id },
    include: { model: Post },
  });

  const topics = topicsDb?.map(item => {
    return item.toJSON();
  });
  return topics;
};

const getTopicById = async id => {
  const topic = await Topic.findByPk(id);
  return topic?.toJSON();
};

const getTopicBySlug = async slug => {
  const topic = await Topic.findOne({
    where: { slug: slug },
    include: {
      all: true,
    },
  });

  return topic?.toJSON();
};

const getTopicByTitle = async title => {
  const topic = await Topic.findOne({
    where: { title: title },
  });
  return topic?.toJSON();
};

const createNewTopic = async dto => {
  const newTopic = await Topic.create(dto);

  return newTopic?.toJSON();
};

module.exports = {
  getTopicById,
  getTopicByTitle,
  getTopicBySlug,
  getAllTopicsByForumId,
  createNewTopic,
};
