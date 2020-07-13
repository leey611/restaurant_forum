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
  }
};

module.exports = categoryService;
