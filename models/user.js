'use strict';
const { hashPassword } = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cuisine, {
        foreignKey: 'authorId'
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "email already exists"
      },
      validate: {
        notEmpty: {
          msg: "email is Required",
        },
        notNull: {
          msg: "email is Required",
        },
        isEmail: {
          args: true,
          msg: "email format is wrong",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password is Required",
        },
        notNull: {
          msg: "password is Required",
        },
        len: {
          args: [5],
          msg: "the minimum password length is 5 characters",
        },
      },
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (instance) => {
        let hash = hashPassword(instance.password) // bcryptJs
        instance.password = hash
        // instance.role = 'Staff'
      }
    }
  });
  return User;
};