const { Category, Forum } = require("../models/models");

const getAllCategories = async () => {
  const categoriesDb = await Category.findAll();
  const categories = categoriesDb?.map(item => {
    return item.toJSON();
  });
  return categories;
};

const getCategoryById = async id => {
  const categoryDb = await Category.findByPk(id);
  return categoryDb?.toJSON();
};

const getCategoryBySlug = async slug => {
  const category = await Category.findOne({
    where: { slug: slug },
    include: {
      model: Forum,
      attributes: ["title", "slug"],
    },
  });

  return category?.toJSON();
};

const getCategoryByTitle = async title => {
  const category = await Category.findOne({
    where: { title: title },
  });
  return category?.toJSON();
};

const createCategory = async dto => {
  const newCategory = await Category.create(dto);

  return newCategory?.toJSON();
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryByTitle,
  createCategory,
};
