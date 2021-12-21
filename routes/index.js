const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const admin = require('./admin')
const category = require('./category')
const product = require('./product')

router.use(authController.checkAuth)
router.use('/admin', admin)
router.use('/category', category)
router.use('/product', product)

module.exports = router
