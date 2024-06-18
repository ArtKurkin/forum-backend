const categoryService = require("../services/categoryService");
const forumService = require("../services/forumService");

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const category = await categoryService.getByCategorySlug(slug);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getForumsBySlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const category = await forumService.getForumsByCategorySlug(slug);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async addCategory(req, res, next) {
    try {
      const newCategory = await categoryService.addCategory(req.body);
      return res.status(200).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
