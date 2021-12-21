const bcrypt = require('bcryptjs')
const sha = require('sha256')
const jwt = require('jsonwebtoken')
const mailgun = require('mailgun-js')
const path = require('path')
const ejs = require('ejs-promise')
const rn = require('random-number')
const moment = require('moment-timezone')
const apifcm = require('../lib/axios')
const config = {
  saltRounds: 12
}

const generateBcrypt = async (data) => new Promise ((resolve, reject) => {
  bcrypt.genSalt(config.saltRounds, (err, salt) => {
    if (err) {
      next(new Error(err.message))
    }
    bcrypt.hash(data, salt, (err, hash) => {
      if (err) {
        next(new Error(err.message))
      }
      resolve(hash)
    })
  })
})

const sha256 = async (data) => {
  const create = sha.x2(data)
  if (create) {
    return create
  } else {
    return false
  }
}

const verifyPassword = async (pass, passdb) => {
  let res
  try {
    const check = await bcrypt.compare(pass, passdb)
    res = check
  } catch (err) {
    res = err
  }
  return res
}

const createToken = async (payload) => {
  let dataToken = {}
  try {
    let data = {
      admin_id: payload.admin_id,
      admin_name: payload.admin_name,
      admin_email: payload.admin_email
    }
    const rawToken = jwt.sign(data, process.env.JWT_SECRET)
    dataToken = {
      user: payload,
      token: rawToken
    }
    return dataToken
  } catch (err) {
    reject(new Error(err.message))
  }
}

const sort = async (sort) => {
  try{
    if (sort == '' || sort === undefined) {
      sort = "{}"
    } else {
      sort = sort.split(",")
      let a = ''
      sort.forEach((d) => {
        d = d.split(":")
        d = '"' + d[0] + '":' + ((d[1] == 'desc') ? -1 : 1)
        a += d + ","
      })
      sort = "{" + a.slice(0, -1) + "}"
    }
    sort = JSON.parse(sort)
    return sort
  } catch(err) {
    reject(new Error(err.message))
  }
}

const search = async (string) => {
  if (string == '' || string === undefined) {
      string = "{}"
  } else {
      string = string.split(",")
      let a = ''
      string.forEach((d) => {
        d = d.split(":")
        d = '{"' + d[0] + '":{"$regex": "' + d[1] + '", "$options": "i"}}'
        a += d + ","
      })
      string = '"$or": [ ' + a.slice(0, -1) + ' ]'
      string = "{ " + string + " }"
  }
  string = JSON.parse(string)
  return string
}

const pagination = async (total, pagenum, limit) => {
  try {
    let total_page = Math.ceil(total / limit)
    let prev = pagenum - 1
    if (prev < 1) {
      prev = 0
    }
    let next = pagenum + 1
    if (next > total_page) {
      next = 0
    }
    let from = 1
    let to = total_page
    let to_page = pagenum - 2
    if (to_page > 0) {
      from = to_page
    }
    if (total_page >= 5) {
      if (total_page > 0) {
        to = 5 + to_page
        if (to > total_page) {
          to = total_page
        }
      } else {
        to = 5
      }
    }
    let firstpage_istrue = false
    let lastpage_istrue = false
    let detail = [];
    if (total_page > 1) {
      for (let i = from; i <= to; i++) {
        detail.push(i)
      }
      if (from != 1) {
        firstpage_istrue = true
      }
      if (to != total_page) {
        lastpage_istrue = true
      }
    }
    let total_display = limit
    if (next == 0) {
      if (total % limit != 0) {
        total_display = total % limit
      }
      if (total_page < pagenum) {
        total_display = 0
      }
    }
    let pagination = {
      total_data: total,
      total_page: total_page,
      total_display: total_display,
      first_page: firstpage_istrue,
      last_page: lastpage_istrue,
      prev: prev,
      current: pagenum,
      next: next,
      detail: detail
    }
    return pagination
  } catch (err) {
    reject(new Error(err.message))
  }
}

const generateRandom = async (data) => {
  const generate = rn.generator({
    min: 100,
    max: 10000,
    integer: true
  })
  let res = data + '000' + moment().format('ss') + generate()
  return res
}

module.exports = {
  generateBcrypt,
  sha256,
  verifyPassword,
  createToken,
  pagination,
  sort,
  search,
  generateRandom
}