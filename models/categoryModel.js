const mongoose = require('mongoose')

const Category = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, 'Please fill your category name']
  },
  category_title: {
    type: String,
    required: [true, 'Please fill your category name']
  }
})

module.exports = mongoose.model('sys_category_products', Category)