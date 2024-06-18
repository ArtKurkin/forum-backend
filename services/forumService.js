const ApiError = require("../exceptions/apiError");
const { forumValidation } = require("../validations/forumValidation");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const sequelize = require("sequelize");
const forumRepository = require("../repositories/forumPostgresRepository");
const categoryRepository = require("../repositories/categoryPostgresRepository");
const topicRepository = require("../repositories/topicPostgresRepository");

class ForumService {
  constructor(forumRepository, categoryRepository, topicRepository) {
    this.forumRepository = forumRepository;
    this.categoryRepository = categoryRepository;
    this.topicRepository = topicRepository;
  }

  async getAllForums() {
    const forums = await this.forumRepository.getAllForums();
    if (!forums?.length) throw ApiError.BadRequest("Не удалось найти форумы");
    return forums;
  }

  async getByForumSlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");

    const forum = await this.forumRepository.getForumBySlug(slug);
    if (!forum) throw ApiError.BadRequest("Не удалось найти пост");

    const topics = await this.topicRepository.getAllTopicsByForumId(forum.id);
    const postsCount = topics?.reduce((currentSum, topic) => {
      return currentSum + topic?.posts?.length;
    }, 0);

    return { ...forum, postsCount };
  }

  async getForumsByCategorySlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");
    try {
      const category = await this.categoryRepository.getCategoryBySlug(slug);
      if (!category) throw ApiError.BadRequest("Не удалось найти категорию");
      const forums = await this.forumRepository.getForumsByCategoryId(
        category.id
      );
      if (!forums?.length) throw ApiError.BadRequest("Не удалось найти форумы");
      return forums;
    } catch (error) {
      throw error;
    }
  }

  async addForum(dto) {
    const { error } = forumValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const categoryDb = await this.categoryRepository.getCategoryById(
        dto.categoryId
      );
      if (!categoryDb) throw ApiError.BadRequest("Не удалось найти категорию");

      const candidate = await this.forumRepository.getForumByTitle(dto.title);
      if (candidate)
        throw ApiError.BadRequest("Форум с таким названием уже существует");

      const cleanedStr = dto.title
        .replace(/[^а-яА-Яa-zA-Z\d]/g, " ")
        .replace(/ +/g, "-")
        .trim();

      const slug = new CyrillicToTranslit().transform(cleanedStr).toLowerCase();

      const newForum = await this.forumRepository.createForum({
        title: dto.title,
        description: dto.description,
        categoryId: categoryDb.id,
        slug: slug,
      });

      return newForum;
    } catch (error) {
      if (error instanceof sequelize.UniqueConstraintError)
        throw ApiError.BadRequest("Форум с таким названием уже существует");
      throw error;
    }
  }
}

module.exports = new ForumService(
  forumRepository,
  categoryRepository,
  topicRepository
);
