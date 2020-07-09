const db = require('../models');
const Comment = db.Comment;

let commentController = {
  postComment: async (req, res) => {
    try {
      Comment.create({
        text: await req.body.text,
        RestaurantId: await req.body.restaurantId,
        UserId: await req.user.id
      });
      res.redirect(`/restaurants/${req.body.restaurantId}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const toDelete = await Comment.findByPk(req.params.id);
      toDelete.destroy();
      res.redirect(`/restaurants/${toDelete.RestaurantId}`);
    } catch (err) {
      console.log(err);
    }
  }
};
module.exports = commentController;
