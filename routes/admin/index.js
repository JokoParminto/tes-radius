const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')

// Protect all routes after this middleware
router.post('/register/admin', authController.registerAdmin)
router.post('/login/admin', authController.login)
router.use(authController.protect)
router.use(authController.restrictTo('admin'))

module.exports = router