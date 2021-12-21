const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const authController = require('../../controllers/authController')

router.use(authController.protect)
router.use(authController.restrictTo('admin'))
router.get('/list', productController.list)
router.get('/detail/:id', productController.detail)
router.post('/create', productController.create)
router.patch('/update', productController.update)

module.exports = router