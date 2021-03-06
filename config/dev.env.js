'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:5757/api"',
  // BASE_API: '"https://00fshnfc.qcloud.la/api"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin',
  // BASE_API: '"https://ggno7ap8.qcloud.la/api"'
  BASE_API: '"https://582667254.mascredit.com.cn/api"'
})
