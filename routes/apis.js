const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const adminController = require('../controllers/api/adminController');
const categoryController = require('../controllers/api/categoryController');
const categoryService = require('../services/categoryService');

router.get('/admin/restaurants', adminController.getRestaurants);
router.get('/admin/restaurants/:id', adminController.getRestaurant);
router.post(
  '/admin/restaurants',
  upload.single('image'),
  adminController.postRestaurant
);
router.put('/admin/restaurants/:id', adminController.putRestaurant);
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant);

router.get('/admin/categories', categoryController.getCategories);
router.post('/admin/categories', categoryService.postCategory);
router.delete('/admin/categories/:id', categoryService.deleteCategory);

module.exports = router;
