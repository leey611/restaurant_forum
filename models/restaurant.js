'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    'Restaurant',
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      address: DataTypes.STRING,
      opening_hours: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      viewCounts: DataTypes.INTEGER
    },
    {}
  );
  Restaurant.associate = function (models) {
    // associations can be defined here
    Restaurant.belongsTo(models.Category);
    Restaurant.hasMany(models.Comment);
    Restaurant.belongsToMany(models.User, {
      //a restaurant can belongs to/be liked by many user
      through: models.Favorite, //through a table called favorite
      foreignKey: 'RestaurantId', //to see how the rest is liked by users, stick the restId
      as: 'FavoritedUsers' //and the result is users who have like this rest
    });
  };
  return Restaurant;
};
