const db = require('../models');

const Restaurant = db.Restaurant;
const Category = db.Category;

let adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then((restaurants) => {
      callback({ restaurants: restaurants });
      //return res.render('admin/restaurants', { restaurants: restaurants });
    });
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    }).then((restaurant) => {
      callback({ restaurant });
      //return res.render('admin/restaurant', { restaurant });
    });
  }
};

module.exports = adminService;
