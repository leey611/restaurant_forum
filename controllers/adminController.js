const fs = require('fs');
const db = require('../models');
const Restaurant = db.Restaurant;
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then((restaurants) => {
      return res.render('admin/restaurants', { restaurants: restaurants });
    });
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create');
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body;
    const { file } = req;
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    if (file) {
      fs.readFile(file.path, (err, data) => {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          console.log(img.data.link);
          //if (err) console.log('Error: ', err);
          //fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was created');
            return res.redirect('/admin/restaurants');
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
        req.flash('success_messages', 'restaurant created successfully');
        res.redirect('/admin/restaurants');
      });
    }
  },
  //get a single restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render('admin/restaurant', { restaurant });
      }
    );
  },
  //render edit page
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        //render the create page, and the create page will have a PUT with params.id
        return res.render('admin/create', { restaurant });
      }
    );
  },
  //PUT update a restaurant
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body;
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
              image: file ? img.data.link : restaurant.image
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
            image: restaurant.image
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
