const express = require('express')
const router = express.Router()

const cuisineRouter = require('./cuisines')
const categoryRouter = require('./categories')

const CuisineController = require('../controllers/CuisineController')
const UserController = require('../controllers/UserController')

const authenTokenMiddleware = require('../middlewares/authentication')
const authorizationAdminOnly = require('../middlewares/authorizationAdminOnly')
const errorHandler = require('../middlewares/errorHandler')

//=============================================================================== // Home

router.get('/', (req, res) => {
    let endpointsInfo = {
        endpointPublic: 'GET /pub/cuisines',
        endpointPublicWithId: 'GET /pub/cuisines/:id'
    }
    res.status(200).json({ message: "Server-side RESTful API Pizza Hot", forPublic: endpointsInfo })
})

//=============================================================================== // Add User + Login

router.get('/pub/cuisines', CuisineController.getAllCuisinesPub)
router.get('/pub/cuisines/:id', CuisineController.getAllCuisinesByIdPub)

router.post('/add-user', authenTokenMiddleware, authorizationAdminOnly, UserController.addUser)
router.post('/login', UserController.login)

//===============================================================================
router.use(authenTokenMiddleware)

//===============================================================================
router.use('/cuisines', cuisineRouter)
router.use('/categories', categoryRouter)

//===============================================================================
router.use(errorHandler)


module.exports = router