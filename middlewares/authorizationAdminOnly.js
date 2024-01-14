function authorizationAdminOnly(req, res, next) {
    try {
        if (req.user.role === 'Admin') {
            next()
        } else {
            throw { name: 'forbiddenAccess-adminOnly' }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = authorizationAdminOnly