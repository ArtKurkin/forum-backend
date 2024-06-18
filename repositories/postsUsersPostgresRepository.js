const { PostsUsers } = require("../models/models");

const getAllPostsUsersByPostId = async id => {
  const postUsersDb = await PostsUsers.findAll({
    where: { postId: id },
  });
  const postUsers = postUsersDb?.map(item => {
    return item.toJSON();
  });
  return postUsers;
};

const getPostUsers = async (postId, userId) => {
  const postsUsers = await PostsUsers.findOne({
    where: { postId: postId, userId: userId },
  });
  return postsUsers?.toJSON();
};

const createNewPostUser = async dto => {
  const newRaiting = await PostsUsers.create(dto);
  return newRaiting?.toJSON();
};

const destroyPostUser = async (postId, userId) => {
  await PostsUsers.destroy({
    where: {
      postId: postId,
      userId: userId,
    },
  });
};

const changePostUser = async (postId, userId, value) => {
  const postUser = await PostsUsers.findOne({
    where: { postId: postId, userId: userId },
  });

  if (postUser) {
    postUser.ratingValue = value;
    await postUser?.save();
  }
  return postUser?.toJSON();
};

module.exports = {
  getPostUsers,
  getAllPostsUsersByPostId,
  createNewPostUser,
  destroyPostUser,
  changePostUser,
};
