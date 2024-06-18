const ApiError = require("../exceptions/apiError");
const {
  postValidation,
  topicValidation,
} = require("../validations/topicValidation");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const sequelize = require("sequelize");
const postService = require("./postService");
const topicRepository = require("../repositories/topicPostgresRepository");
const categoryRepository = require("../repositories/categoryPostgresRepository");
const forumRepository = require("../repositories/forumPostgresRepository");
const topicsUsersRepository = require("../repositories/topicsUsersPostgresRepository");

class TopicService {
  constructor(
    topicRepository,
    categoryRepository,
    forumRepository,
    topicsUsersRepository
  ) {
    this.topicRepository = topicRepository;
    this.categoryRepository = categoryRepository;
    this.forumRepository = forumRepository;
    this.topicsUsersRepository = topicsUsersRepository;
  }

  async getByTopicSlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");

    const topic = await this.topicRepository.getTopicBySlug(slug);
    if (!topic) throw ApiError.BadRequest("Не удалось найти тему");

    const forum = await this.forumRepository.getForumById(topic.forumId);
    const category = await this.categoryRepository.getCategoryById(
      forum.categoryId
    );

    const topicUsers =
      await this.topicsUsersRepository.getAllTopicsUsersByTopicId(topic.id);
    const ratingValue = topicUsers?.reduce((currentSum, item) => {
      return currentSum + item.ratingValue;
    }, 0);

    return {
      ...topic,
      ratingValue,
      topicUsers: topicUsers,
      forum: forum,
      category: category,
    };
  }

  async getTopicsByForumSlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");
    try {
      const forum = await this.forumRepository.getForumBySlug(slug);
      if (!forum) throw ApiError.BadRequest("Не удалось найти форум");
      const topics = await this.topicRepository.getAllTopicsByForumId(forum.id);
      if (!topics?.length) throw ApiError.BadRequest("Не удалось найти темы");

      const newPosts = [];

      for (let i = 0; i < topics.length; i++) {
        const topicUsers =
          await this.topicsUsersRepository.getAllTopicsUsersByTopicId(
            topics[i].id
          );
        const ratingSum = topicUsers.reduce((currentSum, item) => {
          return currentSum + item.ratingValue;
        }, 0);
        newPosts.push({
          ...topics[i],
          ratingValue: ratingSum,
        });
      }

      return newPosts;
    } catch (error) {
      throw error;
    }
  }

  async topicLike(topicId, userId) {
    if (!topicId || !userId)
      throw ApiError.BadRequest("Отсутствует строка идентификатора");
    const topic = await this.topicRepository.getTopicById(topicId);
    if (!topic) throw ApiError.BadRequest("Не удалось найти тему");

    const topicsUsers = await this.topicsUsersRepository.getTopicUser(
      topicId,
      userId
    );

    console.log(topicsUsers?.ratingValue);
    if (!topicsUsers) {
      const newRaiting = await this.topicsUsersRepository.createNewTopicUser({
        topicId: topicId,
        userId: userId,
        ratingValue: 1,
      });
      return newRaiting;
    }

    if (topicsUsers.ratingValue == 1) {
      await this.topicsUsersRepository.destroyTopicUser(topicId, userId);
      return { message: "Пользователь убрал оценку" };
    }

    if (topicsUsers.ratingValue == -1) {
      const newRating = await this.topicsUsersRepository.changeTopicUser(
        topicId,
        userId,
        1
      );
      return newRating;
    }
    console.log(topicsUsers);
    return topicsUsers;
  }

  async topicDislike(topicId, userId) {
    if (!topicId || !userId)
      throw ApiError.BadRequest("Отсутствует строка идентификатора");
    const topic = await this.topicRepository.getTopicById(topicId);
    if (!topic) throw ApiError.BadRequest("Не удалось найти тему");

    const topicsUsers = await this.topicsUsersRepository.getTopicUser(
      topicId,
      userId
    );
    console.log(topicsUsers?.ratingValue);
    if (!topicsUsers) {
      console.log("постюзера нет");
      const newRaiting = await this.topicsUsersRepository.createNewTopicUser({
        topicId: topicId,
        userId: userId,
        ratingValue: -1,
      });
      return newRaiting;
    }

    if (topicsUsers.ratingValue == -1) {
      await this.topicsUsersRepository.destroyTopicUser(topicId, userId);
      return { message: "Пользователь убрал оценку" };
    }

    if (topicsUsers.ratingValue == 1) {
      const newRating = await this.topicsUsersRepository.changeTopicUser(
        topicId,
        userId,
        -1
      );
      return newRating;
    }
    console.log(topicsUsers);
    return topicsUsers;
  }

  async addTopic(dto) {
    const { error } = topicValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const forumDb = await this.forumRepository.getForumById(dto.forumId);
      if (!forumDb) throw ApiError.BadRequest("Не удалось найти форум");

      const candidate = await this.topicRepository.getTopicByTitle(dto.title);
      if (candidate)
        throw ApiError.BadRequest("Тема с таким названием уже существует");

      const cleanedStr = dto.title
        .replace(/[^а-яА-Яa-zA-Z\d]/g, " ")
        .replace(/ +/g, "-")
        .trim();

      const slug = new CyrillicToTranslit().transform(cleanedStr).toLowerCase();

      const newTopic = await this.topicRepository.createNewTopic({
        title: dto.title,
        content: dto.content,
        forumId: forumDb.id,
        userId: dto.userId,
        slug: slug,
      });

      return newTopic;
    } catch (error) {
      if (error instanceof sequelize.UniqueConstraintError)
        throw ApiError.BadRequest("Тема с таким названием уже существует");
      throw error;
    }
  }
}

module.exports = new TopicService(
  topicRepository,
  categoryRepository,
  forumRepository,
  topicsUsersRepository
);
