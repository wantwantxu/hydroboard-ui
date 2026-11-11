'use strict'


const path = require('path')

module.exports = {
  dev: {

    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/fcst': {
        target: 'http://localhost:15013',
        changeOrigin: true,
        pathRewrite: {
          '^/api/fcst': '/fcst'
        },
        secure: false
      },
      '/api/sl': {
        target: 'http://localhost:15013',
        changeOrigin: true,
        pathRewrite: {
          '^/api/sl': '/sl'
        },
        secure: false
      },

      '/api': {
        target: 'http://localhost:15013',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        secure: false
      },
      '/weatherservice': {
        target: ' http://typhoon.nmc.cn/weatherservice',
        changeOrigin: true,
        pathRewrite: {
          '^/weatherservice': ''
        },
        secure: false
      },
      '/warn-release-api': {
        target: ' http://hfc.mwr.cn/warn-release-api/api',
        changeOrigin: true,
        logLever: 'debug',
        pathRewrite: {
          '^/warn-release-api': ''
        },
        secure: false
      },
      '/call': {
        target: ' http://127.0.0.1:15040',
        changeOrigin: true,
        logLever: 'debug',
        pathRewrite: {
          '^/call': ''
        },
        secure: false
      },
      '/api/crontab': {
        target: ' http://127.0.0.1:22320',
        changeOrigin: true,
        logLever: 'debug',
        pathRewrite: {
          '^/api/crontab': ''
        },
        secure: false
      },

      '/meishan': {
        target: 'http://127.0.0.1:2019/geoserver/meishan',
        changeOrigin: true,
        logLever: 'debug',
        pathRewrite: {
          '^/meishan': ''
        },
        secure: false
      },
    },


    host: 'localhost',
    port: 5172,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,


    useEslint: true,

    showEslintErrorsInOverlay: false,

    


    devtool: '#eval-source-map',

    cacheBusting: true,

    cssSourceMap: true
  },

  build: {

    index: path.resolve(__dirname, '../dist/index.html'),


    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    

    productionSourceMap: true,

    devtool: '#source-map',


    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],


    bundleAnalyzerReport: process.env.npm_config_report
  }
}
