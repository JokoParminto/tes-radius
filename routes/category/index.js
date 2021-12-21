const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/categoryController')
const authController = require('../../controllers/authController')

router.use(authController.protect)
router.use(authController.restrictTo('admin'))
router.get('/list', categoryController.list)
router.get('/detail/:id', categoryController.detail)
router.post('/create', categoryController.create)
router.patch('/update', categoryController.update)

module.exports = router