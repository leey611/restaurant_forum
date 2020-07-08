const db = require('../models');
const Category = db.Category;

let categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) =>
      res.render('admin/categories', { categories })
    );
  },
  postCategory: (req, res) => {
    const { name } = req.body;
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch((err) => console.log(err));
  }
};

module.exports = categoryController;
