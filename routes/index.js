const restController = require('../controllers/restControllers');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');

const multer = require('multer');
const { authenticate } = require('passport');
const upload = multer({ dest: 'temp/' });

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect('/');
    }
    res.redirect('/signin');
  };
  const authenticateCurrentUser = (req, res, next) => {
    if (req.user.id === Number(req.params.id)) {
      return next();
    }
    return res.redirect('/');
  };

  app.get('/', authenticated, (req, res) => res.redirect('restaurants'));
  app.get('/restaurants/feeds', authenticated, restController.getFeeds);
  app.get(
    '/restaurants/:id/dashboard',
    authenticated,
    restController.getDashboard
  );
  app.get('/restaurants', authenticated, restController.getRestaurants);
  app.get('/restaurants/:id', authenticated, restController.getRestaurant);

  //Favorite
  app.post(
    '/favorite/:restaurantId',
    authenticated,
    userController.addFavorite
  );
  app.delete(
    '/favorite/:restaurantId',
    authenticated,
    userController.removeFavorite
  );
  //Comment
  app.post('/comments', authenticated, commentController.postComment);
  app.delete(
    '/comments/:id',
    authenticatedAdmin,
    commentController.deleteComment
  );

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers);
  app.get('/admin/users/:id', authenticatedAdmin, adminController.putUser);
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('admin/restaurants')
  );
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  );
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  );
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurant
  );
  app.get(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.getRestaurant
  );
  app.get(
    '/admin/restaurants/:id/edit',
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  );
  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  );
  //categoryController
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.get(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.postCategory
  );
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.putCategory
  );
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.deleteCategory
  );

  //User controller
  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);

  app.get('/signin', userController.signInPage);
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  );
  app.get('/logout', userController.logout);

  app.get('/users/:id', authenticated, userController.getUser);
  app.get(
    '/users/:id/edit',
    authenticated,
    authenticateCurrentUser,
    userController.editUser
  );
  app.put(
    '/users/:id',
    authenticated,
    upload.single('image'),
    userController.putUser
  );
};
