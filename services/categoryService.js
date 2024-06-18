const { categoryValidation } = require("../validations/categoryValidation");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const sequelize = require("sequelize");
const ApiError = require("../exceptions/apiError");
const categoryRepository = require("../repositories/categoryPostgresRepository");

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.getAllCategories();

    if (!categories.length)
      throw ApiError.BadRequest("Не удалось найти категории");
    return categories;
  }

  async getByCategorySlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");
    const category = await this.categoryRepository.getCategoryBySlug(slug);

    if (!category) throw ApiError.BadRequest("Не удалось найти категорию");
    return category;
  }

  async addCategory(dto) {
    const { error } = categoryValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const candidate = await this.categoryRepository.getCategoryByTitle(
        dto.title
      );
      if (candidate)
        throw ApiError.BadRequest("Категория с таким названием уже существует");

      const cleanedStr = dto.title
        .replace(/[^а-яА-Яa-zA-Z\d]/g, " ")
        .replace(/ +/g, "-")
        .trim();

      const slug = new CyrillicToTranslit().transform(cleanedStr).toLowerCase();

      const newCategory = await this.categoryRepository.createCategory({
        title: dto.title,
        description: dto.description,
        slug: slug,
      });

      return newCategory;
    } catch (error) {
      if (error instanceof sequelize.UniqueConstraintError)
        throw ApiError.BadRequest("Категория с таким названием уже существует");
      throw error;
    }
  }
}

module.exports = new CategoryService(categoryRepository);
