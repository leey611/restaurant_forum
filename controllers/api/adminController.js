const fs = require('fs');
const db = require('../../models');
const User = db.User;
const Restaurant = db.Restaurant;
const Category = db.Category;
const imgur = require('imgur-node-api');
//const category = require('../../models/category');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const adminService = require('../../services/adminService');

let adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data);
    });
    // return Restaurant.findAll({
    //   raw: true,
    //   nest: true,
    //   include: [Category]
    // }).then((restaurants) => {
    //   return res.json({ restaurants: restaurants });
    // });
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data);
    });
  }
};

module.exports = adminController;
