const db = require('../models');
const Category = db.Category;

let categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) => {
      if (req.params.id) {
        Category.findByPk(req.params.id, {
          raw: true,
          nest: true
        })
          .then((category) =>
            res.render('admin/categories', { categories, category })
          )
          .catch((err) => console.log(err));
      } else {
        return res.render('admin/categories', { categories });
      }
    });
  },
  postCategory: (req, res) => {
    const { name } = req.body;
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Created successfully');
        return res.redirect('/admin/categories');
      })
      .catch((err) => console.log(err));
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    } else {
      Category.findByPk(req.params.id).then((category) => {
        category
          .update({ name: req.body.name })
          .then(() => {
            req.flash('success_messages', 'Updated successfully');
            return res.redirect('/admin/categories');
          })
          .catch((err) => console.log(err));
      });
    }
  },
  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then((category) => category.destroy())
      .then(() => {
        req.flash('success_messages', 'Delete successfully');
        return res.redirect('/admin/categories');
      })
      .catch((err) => console.log(err));
  }
};

module.exports = categoryController;
