function errorHandler(error, req, res, next) {
    console.log(error)

    let statusCode = 500
    let message = 'Internal Server Error'

    switch (error.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            statusCode = 400
            message = error.errors[0].message
            break;
        case 'usernameOrEmailIsRequired':
            statusCode = 400
            message = 'username or email is required'
            break;
        case 'passwordIsRequired':
            statusCode = 400
            message = 'password is required'
            break;
        case 'fileInvalid':
            statusCode = 400
            message = 'upload the file first.'
            break;
        case 'invalidValue':
            statusCode = 400
            message = 'invalid value!'
            break;
        case 'userNotExists':
        case 'passwordNotValid':
            statusCode = 401
            message = 'invalid username or email or password!'
            break;
        case 'invalidToken':
        case 'JsonWebTokenError':
            statusCode = 401
            message = 'Invalid token'
            break;
        case 'forbiddenAccess':
            statusCode = 403
            message = 'Forbidden Access. Staff can only edit or delete their own.'
            break;
        case 'forbiddenAccess-adminOnly':
            statusCode = 403
            message = 'Forbidden Access. Admin Only'
            break;
        case 'errorNotFound':
            statusCode = 404
            message = 'Error! not found'
            break;
    }

    res.status(statusCode).json({ message })
}

module.exports = errorHandler