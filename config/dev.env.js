'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  MODE: '"DEV"',

  NODE_ENV: '"development"',


  API_HOST:'"/api"',

  API_HOST_MAP: '"http://127.0.0.1:11007"',

})






