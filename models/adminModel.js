const mongoose = require('mongoose')
const validator = require('validator')

const Admin = new mongoose.Schema({
  admin_name: {
    type: String,
    required: [true, 'Please fill your name']
  },
  admin_email: {
    type: String,
    required: [true, 'Please fill your password'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, ' Please provide a valid email']
  },
  admin_password: {
    type: String,
    required: [true, 'Please fill your password'],
    minLength: 6,
    select: false
  },
	admin_role: {
    type: String,
    required: [true, 'Please fill your role']
  },
})

module.exports = mongoose.model('sys_admin', Admin)