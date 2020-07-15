const db = require('../models');

const Restaurant = db.Restaurant;
const Category = db.Category;

let categoryService = {
  getCategories: (req, res, callback) => {
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
        callback({ categories });
        //return res.render('admin/categories', { categories });
      }
    });
  },
  postCategory: (req, res, callback) => {
    const { name } = req.body;
    if (!name) {
      return callback({ status: 'error', message: 'Name is required' });
      //req.flash('error_messages', 'Name is required');
      //return res.redirect('back');
    }
    Category.create({ name })
      .then(() => {
        callback({ status: 'success', message: 'Created successfully' });
        //req.flash('success_messages', 'Created successfully');
        //return res.redirect('/admin/categories');
      })
      .catch((err) => console.log(err));
  },
  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then((category) => category.destroy())
      .then(() => {
        callback({status: 'success', message: 'Delete successfully'})
        //req.flash('success_messages', 'Delete successfully');
        //return res.redirect('/admin/categories');
      })
      .catch((err) => console.log(err));
  }
};

module.exports = categoryService;
