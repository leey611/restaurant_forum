const restControllers = require('../controllers/restControllers');
const adminControllers = require('../controllers/adminController');

module.exports = (app) => {
  app.get('/', (req, res) => res.redirect('restaurants'));
  app.get('/restaurants', restControllers.getRestaurants);
  app.get('/admin', (req, res) => res.redirect('admin/restaurants'));
  app.get('/admin/restaurants', adminControllers.getRestaurants);
};
