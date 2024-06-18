const ApiError = require("../exceptions/apiError");
const { postValidation } = require("../validations/postValidation");
const postRepository = require("../repositories/postPostgresRepository");
const topicRepository = require("../repositories/topicPostgresRepository");
const postsUsersRepository = require("../repositories/postsUsersPostgresRepository");

class PostService {
  constructor(postRepository, topicRepository, postsUsersRepository) {
    this.postRepository = postRepository;
    this.topicRepository = topicRepository;
    this.postsUsersRepository = postsUsersRepository;
  }

  async addPost(dto) {
    const { error } = postValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const topicDb = await this.topicRepository.getTopicById(dto.topicId);
      if (!topicDb) throw ApiError.BadRequest("Не удалось найти тему");

      const newPost = await this.postRepository.createPost({
        content: dto.content,
        topicId: dto.topicId,
        userId: dto.userId,
      });

      return newPost;
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id) {
    console.log(id);
    if (!id) throw ApiError.BadRequest("Отсутствует номер идентификатора");
    try {
      const post = await this.postRepository.getPostById(id);
      if (!post) throw ApiError.BadRequest("Не удалось найти пост");

      await this.postRepository.deletePostById(id);

      return post;
    } catch (error) {
      throw error;
    }
  }

  async getPost(id) {
    if (!id) throw ApiError.BadRequest("Отсутствует номер идентификатора");
    const post = await this.postRepository.getPostById(id);
    if (!post) throw ApiError.BadRequest("Не удалось найти пост");

    const postUsers = await this.postsUsersRepository.getAllPostsUsersByPostId(
      post.id
    );
    const ratingValue = postUsers?.reduce((currentSum, item) => {
      return currentSum + item.ratingValue;
    }, 0);

    return {
      ...post,
      ratingValue,
      postUsers: postUsers,
    };
  }

  async getPostsByTopicSlug(slug, page, limit, sort) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const topic = await this.topicRepository.getTopicBySlug(slug);

    if (!topic) throw ApiError.BadRequest("Не удалось найти тему");

    const results = {};

    if (startIndex > 0) {
      results.previous = {
        page: parseInt(page) - 1,
        limit: parseInt(limit),
      };
    }

    const { count, posts } =
      await this.postRepository.findAllPostsAndCountByTopicId(topic.id);
    console.log(count);

    if (endIndex < posts.length) {
      results.next = {
        page: parseInt(page) + 1,
        limit: parseInt(limit),
      };
    }

    const newPosts = [];

    for (let i = 0; i < posts.length; i++) {
      const postUsers =
        await this.postsUsersRepository.getAllPostsUsersByPostId(posts[i].id);
      const ratingSum = postUsers.reduce((currentSum, item) => {
        return currentSum + item.ratingValue;
      }, 0);
      newPosts.push({ ...posts[i], ratingValue: ratingSum });
    }

    if (sort == "downdate") {
      const finalPosts = newPosts
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        })
        .slice(startIndex, endIndex);
      results.results = finalPosts;
    } else if (sort == "update") {
      const finalPosts = newPosts
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        })
        .slice(startIndex, endIndex);
      results.results = finalPosts;
    } else if (sort == "downrating") {
      const finalPosts = newPosts
        .sort((a, b) => {
          return a.ratingValue - b.ratingValue;
        })
        .slice(startIndex, endIndex);
      results.results = finalPosts;
    } else if (sort == "uprating") {
      const finalPosts = newPosts
        .sort((a, b) => {
          return b.ratingValue - a.ratingValue;
        })
        .slice(startIndex, endIndex);
      results.results = finalPosts;
    } else {
      const finalPosts = newPosts.slice(startIndex, endIndex);
      results.results = finalPosts;
    }
    results.totalCount = count;
    return results;
  }

  async postLike(postId, userId) {
    if (!postId || !userId)
      throw ApiError.BadRequest("Отсутствует строка идентификатора");

    const post = await this.postRepository.getPostById(postId);
    if (!post) throw ApiError.BadRequest("Не удалось найти тему");

    const postsUsers = await this.postsUsersRepository.getPostUsers(
      postId,
      userId
    );

    console.log(postsUsers?.ratingValue);
    if (!postsUsers) {
      const newRaiting = await this.postsUsersRepository.createNewPostUser({
        postId: postId,
        userId: userId,
        ratingValue: 1,
      });
      return newRaiting;
    }

    if (postsUsers.ratingValue == 1) {
      await this.postsUsersRepository.destroyPostUser(postId, userId);
      return { message: "Пользователь убрал оценку" };
    }

    if (postsUsers.ratingValue == -1) {
      const newRating = await this.postsUsersRepository.changePostUser(
        postId,
        userId,
        1
      );
      return newRating;
    }
    console.log(postsUsers);
    return postsUsers;
  }

  async postDislike(postId, userId) {
    if (!postId || !userId)
      throw ApiError.BadRequest("Отсутствует строка идентификатора");

    const post = await this.postRepository.getPostById(postId);
    if (!post) throw ApiError.BadRequest("Не удалось найти тему");

    const postsUsers = await this.postsUsersRepository.getPostUsers(
      postId,
      userId
    );
    console.log(postsUsers?.ratingValue);
    if (!postsUsers) {
      console.log("постюзера нет");
      const newRaiting = await this.postsUsersRepository.createNewPostUser({
        postId: postId,
        userId: userId,
        ratingValue: -1,
      });
      return newRaiting;
    }

    if (postsUsers.ratingValue == -1) {
      await this.postsUsersRepository.destroyPostUser(postId, userId);
      return { message: "Пользователь убрал оценку" };
    }

    if (postsUsers.ratingValue == 1) {
      const newRating = await this.postsUsersRepository.changePostUser(
        postId,
        userId,
        -1
      );
      return newRating;
    }
    console.log(postsUsers);
    return postsUsers;
  }
}

module.exports = new PostService(
  postRepository,
  topicRepository,
  postsUsersRepository
);
