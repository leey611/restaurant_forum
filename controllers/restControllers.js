const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const User = db.User;
const Comment = db.Comment;
const Favorite = db.Favorite;

const pageLimit = 10; // How many items shown per page

let restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {};
    let categoryId = '';
    let offset = 0; //start item per page

    //check if there is a page number specified
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery['CategoryId'] = categoryId;
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then((result) => {
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(result.count / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      //const test = result.rows.map((r) => console.log(r.Category.name));

      const data = result.rows.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          r.id
        ),
        isLiked: req.user.LikedRestaurants.map((d) => d.id).includes(r.id)
      }));
      Category.findAll({ raw: true, nest: true }).then((categories) =>
        res.render('restaurants', {
          restaurants: data,
          categories,
          page,
          totalPage,
          prev,
          next,
          categoryId
        })
      );
      // return res.render('restaurants', {
      //   restaurants: data
      // });
    });
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then((restaurant) => {
        const isFavorited = restaurant.FavoritedUsers.map((d) => d.id).includes(
          req.user.id
        );
        const isLiked = restaurant.LikedUsers.map((d) => d.id).includes(
          req.user.id
        );
        restaurant.increment('viewCounts');
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        });
      })
      .catch((err) => console.log(err));
  },
  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then((restaurants) => {
      restaurants = restaurants.map((r) => ({
        ...r.dataValues,
        FavoriteCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          r.id
        )
      }));
      restaurants = restaurants
        .sort((a, b) => b.FavoriteCount - a.FavoriteCount)
        .slice(0, 10);
      return res.render('topRestaurant', { restaurants });
    });
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then((comments) => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        });
      });
    });
  },
  getDashboard: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, Comment]
      });
      const bookmarks = await Favorite.findAndCountAll({
        where: { RestaurantId: await restaurant.id }
      });

      res.render('dashboard', {
        restaurant: restaurant.toJSON(),
        comments: restaurant.Comments.length,
        bookmarks: bookmarks.count,
        viewCounts: restaurant.viewCounts
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
};
module.exports = restController;
