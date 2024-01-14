const { Cuisine, User, Category } = require('../models')
const { Op } = require("sequelize");
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class CuisineController {
    static async createCuisine(req, res, next) {
        try {
            let { name, description, price, imgUrl, categoryId } = req.body
            let data = await Cuisine.create({ name, description, price, imgUrl, categoryId, authorId: req.user.id })
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async getAllCuisines(req, res, next) {
        try {
            let { search, sort, filter, page } = req.query
            if (
                search === '' ||
                sort === '' ||
                filter === '' ||
                page === ''
            ) {
                throw { name: 'invalidValue' }  // jika query sama dengan kosong
            }

            let options = {
                include: {
                    model: User,
                    attributes: {
                        exclude: ['password']
                    }
                },
                where: {},
            }

            if (search) {
                options.where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }

            if (sort) {
                if (sort === 'old') {
                    options.order = [['createdAt', 'ASC']]
                } else if (sort === 'new') {
                    options.order = [['createdAt', 'DESC']]
                } else {
                    throw { name: 'invalidValue' }
                }
            }

            if (filter) {
                if (filter.categoryId === '') {
                    throw { name: 'invalidValue' }
                } else if (!Number(filter.categoryId)) {
                    throw { name: 'invalidValue' }
                } else {
                    let data = filter.categoryId.split(',').map(el => ({
                        [Op.eq]: el
                    }))
                    options.where.categoryId = {
                        [Op.or]: data
                    }
                }
            }

            if (page) {
                if (!page.size && !page.number) {
                    throw { name: 'invalidValue' }
                } else {
                    if (page.size) {
                        options.limit = Number(page.size)
                    }
                    if (page.number) {
                        if (!page.size) {
                            page.size = 10 // limit default
                            options.limit = 10
                        }
                        options.offset = page.number * page.size - page.size
                    }
                }
            } else {
                options.limit = 10 // limit default
                options.offset = 0
            }

            let totalData = await Cuisine.findAll({
                where : options.where
            })

            let data = await Cuisine.findAll(options)
            if (data.length <= 0) {
                throw { name: 'errorNotFound' }
            }
            res.status(200).json({ 
                message: "Successfully Received Data", 
                totalData: totalData.length,  
                pageSize: options.limit, 
                pageNumber: options.offset, 
                data })
        } catch (error) {
            next(error)
        }
    }

    static async getAllCuisinesById(req, res, next) {
        try {
            let data = await Cuisine.findByPk(req.params.id)
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                return res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static async updateCuisine(req, res, next) {
        try {
            let data = await Cuisine.findByPk(req.params.id)
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

    static async uploadImgUrl(req, res, next) {
        try {
            let dataCuisine = await Cuisine.findByPk(req.params.id)
            if (!dataCuisine) {
                throw { name: 'errorNotFound' }
            } else {
                if (!req.file) {
                    throw { name: 'fileInvalid' }
                }
                let bufferString = req.file.buffer.toString('base64')
                let dataToUpload = `data:${req.file.mimetype};base64,${bufferString}`
                let sendFile = await cloudinary.uploader.upload(dataToUpload, {
                    public_id: req.file.originalname,
                    folder: 'restaurant-p2-c1',
                    resource_type: 'auto'
                })

                await dataCuisine.update({ imgUrl: sendFile.secure_url })
                res.status(200).json({ message: `Image ${req.file.originalname} success to update` })
            }
        } catch (error) {
            next(error)
        }
    }

    static async deleteCuisine(req, res, next) {
        try {
            let data = await Cuisine.findByPk(req.params.id)
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

    //==================================================================================

    static async getAllCuisinesPub(req, res, next) {
        try {
            let { search, sort, filter, page } = req.query
            if (
                search === '' ||
                sort === '' ||
                filter === '' ||
                page === ''
            ) {
                throw { name: 'invalidValue' }  // jika query sama dengan kosong
            }

            let options = {
                where: {},
            }

            if (search) {
                options.where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }

            if (sort) {
                if (sort === 'old') {
                    options.order = [['createdAt', 'ASC']]
                } else if (sort === 'new') {
                    options.order = [['createdAt', 'DESC']]
                } else {
                    throw { name: 'invalidValue' }
                }
            }

            if (filter) {
                if (filter.categoryId === '') {
                    throw { name: 'invalidValue' }
                } else if (!Number(filter.categoryId)) {
                    throw { name: 'invalidValue' }
                } else {
                    let data = filter.categoryId.split(',').map(el => ({
                        [Op.eq]: el
                    }))
                    options.where.categoryId = {
                        [Op.or]: data
                    }
                }
            }

            if (page) {
                if (!page.size && !page.number) {
                    throw { name: 'invalidValue' }
                } else {
                    if (page.size) {
                        options.limit = Number(page.size)
                    }
                    if (page.number) {
                        if (!page.size) {
                            page.size = 10 // limit default
                            options.limit = 10
                        }
                        options.offset = page.number * page.size - page.size
                    }
                }
            } else {
                options.limit = 10 // limit default
                options.offset = 0
            }
            let totalData = await Cuisine.findAll({
                where : options.where
            })
            let data = await Cuisine.findAll(options)
            if (data.length <= 0) {
                throw { name: 'errorNotFound' }
            }
            res.status(200).json({ 
                message: "Successfully Received Data", 
                totalData: totalData.length,  
                pageSize: options.limit, 
                pageNumber: options.offset, 
                data })
        } catch (error) {
            next(error)
        }
    }

    static async getAllCuisinesByIdPub(req, res, next) {
        try {
            let data = await Cuisine.findByPk(req.params.id)
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                return res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = CuisineController