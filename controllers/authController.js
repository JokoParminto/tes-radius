const { promisify } = require('util')
const Admin = require('../models/adminModel')
const AppError = require('../utils/appError')
const common = require('../utils/common')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.login = async (req, res, next) => {
  let code = 304
  let msg = 'Terjadi kesalahan'
  let dataToken = ''
  try {
    const {
      email,
      password
    } = req.body
    if (!email || !password) {
      code = 203
      msg = 'Email Atau Password tidak boleh kosong'
    } else {
      let dataAdmin = await Admin.findOne({
        email: email
      })
     
      if (!dataAdmin || !await common.verifyPassword(password, dataAdmin.admin_password)) {
        code = 401
        msg = 'Email atau Password tidak sesuai!!'
      } else {
        const data = {
          admin_id: dataAdmin._id,
          admin_name: dataAdmin.admin_name,
          admin_email: dataAdmin.admin_email
        }
        const token = await common.createToken(data)
        if (token) {
          msg = 'Berhasil'
          code = 200
          dataToken = token
        }
      }
    }
    res.status(200).json({
      code: code,
      msg: msg,
      data: dataToken
    })
  } catch (err) {
    next(err)
  }
}

exports.registerAdmin = async (req, res, next) => {
  let code = 304
  let msg = 'gagal menyimpan data'
  let admin = ''
  try {
    const password = await common.generateBcrypt(req.body.password)
    admin = await Admin.create({
      admin_name: req.body.name,
      admin_email: req.body.email,
      admin_password: password,
      admin_role: 'admin'
    })
    if (admin !== '') {
      code = 201
      msg = 'data berhasil disimpan'
    }
    res.status(201).json({
      code: code,
      msg: msg
    })
  } catch (err) {
    next(err)
  }
}

exports.protect = async (req, res, next) => {
  try {
    // 1) check if the token is there
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next)
    }
    // 2) Verify token 
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) check if the user is exist (not deleted)
    const obj = mongoose.Types.ObjectId
    const admin = await Admin.findById(obj(decode.admin_id))
    if (!admin) {
      return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next)
    }
    req.admin = admin
    next()
  } catch (err) {
    next(err)
  }
}

/* Authorization check if the user have rights to do this action */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.admin_role)) {
      return next(new AppError(403, 'fail', 'You are not allowed to do this action'), req, res, next)
    }
    next()
  }
}

exports.checkAuth = async (req, res, next) => {
  try {
    if (!req.headers['x-auth'] || req.headers['x-auth'] !== process.env.AUTH_KEY) {
      res.status(401).json({
        code: 401,
        status: 'error',
        msg: 'Access denied. No token provided'
      });
    } else { 
      next()
    }
  } catch (err) {
    next(err)
  }
}