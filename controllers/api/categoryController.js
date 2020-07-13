const db = require('../../models');
const Category = db.Category;

const categorService = require('../../services/categoryService');

let categoryController = {
  getCategories: (req, res) => {
    categorService.getCategories(req, res, (data) => {
      return res.json(data);
    });
  }
};

module.exports = categoryController;
