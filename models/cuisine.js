'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuisine.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Cuisine.belongsTo(models.User, { foreignKey: 'authorId' })
    }
  }
  Cuisine.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name is Required",
        },
        notNull: {
          msg: "name is Required",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "description is Required",
        },
        notNull: {
          msg: "description is Required",
        },
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "price is Required",
        },
        notNull: {
          msg: "price is Required",
        },
        min: {
          args: 20000,
          msg: "The minimum price is Rp 20.000"
        }
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "imgUrl is Required",
        },
        notNull: {
          msg: "imgUrl is Required",
        },
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "categoryId is Required",
        },
        notNull: {
          msg: "categoryId is Required",
        },
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "authorId is Required",
        },
        notNull: {
          msg: "authorId is Required",
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Cuisine',
  });
  return Cuisine;
};