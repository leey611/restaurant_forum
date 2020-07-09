const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
let restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {};
    let categoryId = '';
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery['CategoryId'] = categoryId;
    }
    Restaurant.findAll({ include: Category, where: whereQuery }).then(
      (restaurants) => {
        const data = restaurants.map((r) => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }));
        Category.findAll({ raw: true, nest: true }).then((categories) =>
          res.render('restaurants', {
            restaurants: data,
            categories,
            categoryId
          })
        );
        // return res.render('restaurants', {
        //   restaurants: data
        // });
      }
    );
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then((restaurant) => res.render('restaurant', { restaurant }))
      .catch((err) => console.log(err));
  }
};
module.exports = restController;
