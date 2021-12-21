const mongoose = require('mongoose')

const Product = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, 'Please fill your name']
  },
	product_desc: {
    type: String,
    required: [true, 'Please fill your desc']
  },
  product_price: {
    type: Number,
    required: [true, 'Please fill your price']
  },
	product_stock: {
    type: Number,
    required: [true, 'Please fill your stok']
  },
	product_img: {
    type: String,
    required: [true, 'Please fill your image']
  },
	product_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'id kategori tidak boleh kosong']
  },
  product_category_title: {
    type: String,
    required: [true, 'title kategori tidak boleh kosong']
  },
})

module.exports = mongoose.model('sys_products', Product)