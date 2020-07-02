const db = require('../models');
const Restaurant = db.Restaurant;

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
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    return Restaurant.create({
      name,
      tel,
      address,
      opening_hours,
      description
    }).then((restaurant) => {
      req.flash('success_messages', 'restaurant created successfully');
      res.redirect('/admin/restaurants');
    });
  },
  //get a single restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      return res.render('admin/restaurant', { restaurant });
    });
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
    if (!name) {
      req.flash('error_messages', 'Name is required');
      return res.redirect('back');
    }
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant
        .update({
          name,
          tel,
          address,
          opening_hours,
          description
        })
        .then((restaurant) => {
          req.flash('success_messages', 'restaurant updated successfully');
          res.redirect('/admin/restaurants');
        });
    });
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
