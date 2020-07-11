'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Comment);
    // a user can have many restaurants
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite, //through a favorite table (which shows the Many to Many relationship)
      foreignKey: 'UserId', //to see what rest a user has liked, stick UserId
      as: 'FavoritedRestaurants' //the result is what rest the user has
    });
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedRestaurants'
    });
  };
  return User;
};
