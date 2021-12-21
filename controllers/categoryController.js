const Category = require('../models/categoryModel')
const mongoose = require('mongoose')
const common = require('../utils/common')

exports.create = async (req, res, next) => {
  let code = 304
  let msg = 'gagal menyimpan data'
  try {
    const insert = await Category.create({
      category_name: req.body.category_name
    })
    if (insert !== null) {
      code = 201
      msg = 'data berhasil disimpan'
    }
    res.status(201).json({ code: code, msg: msg })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  let code = 304
  let msg = 'gagal menyimpan data'
  const obj = mongoose.Types.ObjectId
  try {
    const data = {
      category_name: req.body.category_name ? req.body.category_name : {},
      category_title: req.body.category_title ? req.body.category_title : {}
    }
    update = await Category.findOneAndUpdate({
      _id: obj(req.body.id)
    }, data)
    if (update !== null) {
      code = 201
      msg = 'data berhasil diupdate'
    }
    res.status(201).json({ code: code, msg: msg })
  } catch (err) {
    next(err)
  }
}

exports.list = async (req, res, next) => {
  try {
    let query = {}
    let name = req.query ? (req.query.name || '') : ''
    let sort = req.query ? (req.query.sort || '') : ''
    let search = req.query ? (req.query.search || '') : ''
    let limit = parseInt(req.query ? (req.query.limit || 10) : 10)
    let page = parseInt(req.query ? (req.query.pagenum || 1) : 1)
    let start = parseInt((page - 1) * limit);
    sort = await common.sort(sort)
    search = await common.search(search)
    let count
    let get
    if (search !== '') {
      query = {...query,...search}
    }
    if (name !== '') {
      query.category_name = { $regex: new RegExp("^" + name.toLowerCase(), "i") }
    }
    
    get = await Category.find(query).sort(sort).limit(limit).skip(start)
    count = await Category.find(query).count()
    let pagination = await common.pagination(count, page, limit)
    res.status(200).json({ code: 200, msg: 'berhasil', data: get, pagination: pagination })
  } catch (err) {
    next(err)
  }
}

exports.detail = async (req, res, next) => {
  code = 304
  msg = 'Data tidak tersedia !!'
  const obj = mongoose.Types.ObjectId
  try {
    const get = await Category.findOne({
      _id: obj(req.params.id)
    })
    if (get !== null) {
      code = 200
      msg = 'berhasil'
    }
    res.status(200).json({ code: code, msg: msg, data: get })
  } catch (err) {
    next(err)
  }
}
