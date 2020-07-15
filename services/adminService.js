const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
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
  },
  postRestaurant: (req, res, callback) => {
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
      callback({ status: 'error', message: 'name is required' });
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
          callback({
            status: 'success',
            message: 'restaurant created successfully'
          });
        });
      });
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      }).then((restaurant) => {
        callback({
          status: 'success',
          message: 'restaurant created successfully'
        });
      });
    }
  },
  putRestaurant: (req, res, callback) => {
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
      callback({ status: 'error', message: 'name is required' });
      //req.flash('error_messages', 'Name is required');
      //return res.redirect('back');
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
              callback({
                status: 'success',
                message: 'restaurant updated successfully'
              });
              //req.flash('success_messages', 'restaurant updated successfully');
              //res.redirect('/admin/restaurants');
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
            callback({
              status: 'success',
              message: 'restaurant updated successfully'
            });
            //req.flash('success_messages', 'restaurant updated successfully');
            //res.redirect('/admin/restaurants');
          });
      });
    }
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        callback({ status: 'success', message: 'Delete successfully' });
      });
    });
  }
};

module.exports = adminService;
