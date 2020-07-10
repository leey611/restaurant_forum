const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'Confirmed password not correct');
      return res.redirect('/signup');
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', 'This email has been registered');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
            image: `https://loremflickr.com/320/240/restaurant,food/?random=${
              Math.random() * 100
            }`
          }).then((user) => {
            req.flash('success_messages', 'Register successfully');
            return res.redirect('/signin');
          });
        }
      });
    }
  },
  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  getUser: async (req, res) => {
    //console.log(req.user);
    try {
      //check if it's current user. If yes, set isCurrentUser true, if not, they can still see the targetUser's profile
      const currentUser = await User.findByPk(req.user.id, {
        include: { model: Comment, include: [Restaurant] }
      });
      if (req.user.id === Number(req.params.id)) {
        //console.log(currentUser.toJSON());
        res.render('user', { user: currentUser.toJSON(), isCurrentUser: true });
      } else {
        const targetUser = await User.findByPk(req.params.id);
        res.render('user', {
          user: currentUser.toJSON(),
          targetUser: targetUser.toJSON(),
          isCurrentUser: false
        });
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  editUser: async (req, res) => {
    try {
      //check if it's the current user who intends to edit. If not, back to last page
      if (req.user.id !== Number(req.params.id)) {
        return res.redirect('back');
      }
      const toEdit = await User.findByPk(req.params.id);
      res.render('user_edit');
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  putUser: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', 'Name is required');
        return res.redirect('back');
      }
      const { file } = req;
      const toUpdate = await User.findByPk(req.params.id);
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          toUpdate
            .update({
              name: req.body.name,
              image: img.data.link
            })
            .then(() => {
              req.flash('success_messages', 'Updated successfully');
              res.redirect(`/users/${toUpdate.id}`);
            })
            .catch((err) => console.log(err));
        });

        // fs.readFile(file.path, (err, data) => {
        //   if (err) throw err;
        //   fs.writeFile(`upload/${file.originalname}`, data, () => {
        //     toUpdate.update({
        //       name: req.body.name,
        //       image: `/upload/${file.originalname}`
        //     });
        //   });
        // });

        // req.flash('success_messages', 'Updated successfully');
        // res.redirect(`/users/${toUpdate.id}`);
      } else {
        toUpdate.update({
          name: req.body.name,
          image: toUpdate.image
        });
        req.flash('success_messages', 'Updated successfully');
        res.redirect(`/users/${toUpdate.id}`);
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
};

module.exports = userController;
