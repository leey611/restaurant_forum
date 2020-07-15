const fs = require('fs');
const db = require('../models');
const User = db.User;
const Restaurant = db.Restaurant;
const Category = db.Category;
const imgur = require('imgur-node-api');
const category = require('../models/category');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const adminService = require('../services/adminService');

let adminController = {
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', { users });
    });
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        return user.update({
          isAdmin: !user.isAdmin
        });
      })
      .then(() => {
        req.flash('success_messages', 'user updated successfully');
        res.redirect('/admin/users');
      });
  },
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data);
    });
    // return Restaurant.findAll({
    //   raw: true,
    //   nest: true,
    //   include: [Category]
    // }).then((restaurants) => {
    //   return res.render('admin/restaurants', { restaurants: restaurants });
    // });
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) =>
      res.render('admin/create', { categories })
    );
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/restaurants');
    });
  },
  //PUT update a restaurant
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/restaurants');
    });
  },
  //get a single restaurant
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data);
    });
    // return Restaurant.findByPk(req.params.id, {
    //   raw: true,
    //   nest: true,
    //   include: [Category]
    // }).then((restaurant) => {
    //   return res.render('admin/restaurant', { restaurant });
    // });
  },
  //render edit page
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        //render the create page, and the create page will have a PUT with params.id
        Category.findAll({ raw: true, nest: true }).then((categories) =>
          res.render('admin/create', { restaurant, categories })
        );
        //return res.render('admin/create', { restaurant });
      }
    );
  },
  //Delete a restaurant
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants');
      }
    });
  }
};

module.exports = adminController;
