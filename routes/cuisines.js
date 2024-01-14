const express = require('express')
const router = express.Router()
const CuisineController = require('../controllers/CuisineController')

const authorizationOwnerCuisine = require('../middlewares/authorizationOwnerCuisine')

const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', CuisineController.createCuisine)
router.get('/', CuisineController.getAllCuisines)
router.get('/:id', CuisineController.getAllCuisinesById)
router.put('/:id', authorizationOwnerCuisine, CuisineController.updateCuisine)
router.patch('/:id/img-url', authorizationOwnerCuisine, upload.single('imgUrl'), CuisineController.uploadImgUrl)
router.delete('/:id', authorizationOwnerCuisine, CuisineController.deleteCuisine)


module.exports = router