const { Cuisine } = require('../models');

async function authorizationOwnerCuisine(req, res, next) {
    try {
        let data = await Cuisine.findByPk(req.params.id)
        if (!data) {
            throw { name: "errorNotFound" }
        }
        if (req.user.role === 'Staff' && data.authorId !== req.user.id) {
            throw { name: 'forbiddenAccess' }
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authorizationOwnerCuisine