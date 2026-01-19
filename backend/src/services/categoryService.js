const CategoryModel = require('../models/categoryModel');

class CategoryService {
  async getAllCategories() {
    return await CategoryModel.getAll();
  }

  async getCategoryById(id) {
    const category = await CategoryModel.getById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(data) {
    if (!data.name) {
      throw new Error('Category name is required');
    }
    // Check uniqueness if needed, but DB constraint handles it too. 
    // Explicit check could be nicer for error message.
    return await CategoryModel.create(data);
  }

  async updateCategory(id, data) {
    if (!data.name) {
      throw new Error('Category name is required');
    }
    const result = await CategoryModel.update(id, data);
    if (result.changes === 0) {
      throw new Error('Category not found');
    }
    return { id, ...data };
  }

  async deleteCategory(id) {
    const result = await CategoryModel.delete(id);
    if (result.changes === 0) {
      throw new Error('Category not found');
    }
    return result;
  }
}

module.exports = new CategoryService();
