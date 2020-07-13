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
    const {
      name,
      tel,
      address,
      opening_hours,
      description,
      categoryId
    } = req.body;
    const { file } = req;
    console.log('file==>>>', req.file);
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant created successfully');
          return res.redirect('/admin/restaurants');
        });
      });
      // fs.readFile(file.path, (err, data) => {
      //   imgur.setClientID(IMGUR_CLIENT_ID);
      //   imgur.upload(file.path, (err, img) => {
      //     console.log(img.data.link);
      //     //if (err) console.log('Error: ', err);
      //     //fs.writeFile(`upload/${file.originalname}`, data, () => {
      //     return Restaurant.create({
      //       name,
      //       tel,
      //       address,
      //       opening_hours,
      //       description,
      //       image: file ? img.data.link : null
      //     }).then((restaurant) => {
      //       req.flash('success_messages', 'restaurant was created');
      //       return res.redirect('/admin/restaurants');
      //     });
      //   });
      // });
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant created successfully');
        res.redirect('/admin/restaurants');
      });
    }
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
  //PUT update a restaurant
  putRestaurant: (req, res) => {
    const {
      name,
      tel,
      address,
      opening_hours,
      description,
      categoryId
    } = req.body;
    const { file } = req;
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant updated successfully');
              res.redirect('/admin/restaurants');
            });
        });
      });
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId: categoryId
          })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant updated successfully');
            res.redirect('/admin/restaurants');
          });
      });
    }
  },
  //Delete a restaurant
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) =>
      restaurant
        .destroy()
        .then((restaurant) => res.redirect('/admin/restaurants'))
    );
  }
};

module.exports = adminController;
