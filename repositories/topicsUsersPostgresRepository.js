const { TopicsUsers } = require("../models/models");

const getAllTopicsUsersByTopicId = async id => {
  const topicsUsersDb = await TopicsUsers.findAll({
    where: { topicId: id },
  });
  const topicUsers = topicsUsersDb?.map(item => {
    return item.toJSON();
  });
  return topicUsers;
};

const getTopicUser = async (topicId, userId) => {
  const topicUser = await TopicsUsers.findOne({
    where: { topicId: topicId, userId: userId },
  });
  return topicUser?.toJSON();
};

const createNewTopicUser = async dto => {
  const newRaiting = await TopicsUsers.create(dto);
  return newRaiting?.toJSON();
};

const destroyTopicUser = async (topicId, userId) => {
  await TopicsUsers.destroy({
    where: {
      topicId: topicId,
      userId: userId,
    },
  });
};

const changeTopicUser = async (topicId, userId, value) => {
  const topicUser = await TopicsUsers.findOne({
    where: { topicId: topicId, userId: userId },
  });

  if (topicUser) {
    topicUser.ratingValue = value;
    await topicUser?.save();
  }
  return topicUser?.toJSON();
};

module.exports = {
  getTopicUser,
  getAllTopicsUsersByTopicId,
  createNewTopicUser,
  destroyTopicUser,
  changeTopicUser,
};
