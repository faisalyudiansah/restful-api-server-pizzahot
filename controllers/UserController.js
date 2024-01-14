const { Cuisine, User, Category } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class UserController {
    static async addUser(req, res, next) {
        try {
            let data = await User.create(req.body)
            res.status(201).json({
                id: data.id,
                username: data.username,
                email: data.email,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            let { username, email, password } = req.body
            if (!password) {
                throw { name: "passwordIsRequired" }
            }
            if (!username && !email) {
                throw { name: "usernameOrEmailIsRequired" }
            }

            let options = {}
            if (username) {
                options.where = { username }
            } else if(email) {
                options.where = { email }
            }

            let data = await User.findOne(options)
            if (!data) {
                throw { name: "userNotExists" }
            }

            let checkPassword = comparePassword(password, data.password)
            if (!checkPassword) {
                throw { name: "passwordNotValid" }
            }

            let access_token = signToken(data)
            res.status(200).json({ access_token, username : data.username, email : data.email, role : data.role })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController