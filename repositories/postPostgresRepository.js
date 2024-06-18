const { Post, User } = require("../models/models");

const findAllPostsAndCountByTopicId = async id => {
  const { count, rows } = await Post.findAndCountAll({
    where: { topicId: id },
    include: [
      {
        model: User,
        attributes: ["id", "name", "slug"],
      },
    ],
  });

  const posts = rows?.map(item => {
    return item.toJSON();
  });

  return {
    count,
    posts,
  };
};

const getPostById = async id => {
  const post = await Post.findByPk(id);
  return post?.toJSON();
};

const createPost = async dto => {
  const newPost = await Post.create(dto);
  return newPost?.toJSON();
};

const deletePostById = async id => {
  await Post.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  getPostById,
  createPost,
  deletePostById,
  findAllPostsAndCountByTopicId,
};
