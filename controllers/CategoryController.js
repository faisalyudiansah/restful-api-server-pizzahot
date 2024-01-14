const { Cuisine, User, Category } = require('../models')

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            let data = await Category.create(req.body)
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req, res, next) {
        try {
            let data = await Category.findAll()
            res.status(200).json({ message: "Successfully Received Data", data })
        } catch (error) {
            next(error)
        }
    }

    static async updateCategory(req, res, next) {
        try {
            let data = await Category.findByPk(req.params.id)
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                await data.update(req.body)
                res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            let data = await Category.findByPk(req.params.id)
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                await data.destroy()
                res.status(200).json({ message: `${data.name} Success to delete` })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CategoryController