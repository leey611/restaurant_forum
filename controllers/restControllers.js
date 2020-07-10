const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const User = db.User;
const Comment = db.Comment;

const pageLimit = 10; // How many items shown per page

let restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {};
    let categoryId = '';
    let offset = 0; //start item per page

    //check if there is a page number specified
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery['CategoryId'] = categoryId;
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then((result) => {
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(result.count / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      const test = result.rows.map((r) => console.log(r.Category.name));

      const data = result.rows.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
        //categoryName: r.Category.name
      }));
      Category.findAll({ raw: true, nest: true }).then((categories) =>
        res.render('restaurants', {
          restaurants: data,
          categories,
          page,
          totalPage,
          prev,
          next,
          categoryId
        })
      );
      // return res.render('restaurants', {
      //   restaurants: data
      // });
    });
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [Category, { model: Comment, include: [User] }]
    })
      .then((restaurant) => {
        res.render('restaurant', { restaurant: restaurant.toJSON() });
      })
      .catch((err) => console.log(err));
  }
};
module.exports = restController;
