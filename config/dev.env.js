'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://119.27.179.175:12004/portal"',
  BASE_API: '"/api/v1"',
  TUI_WS_SERVERURL:'"ws://119.27.179.175:12010"',
  CTI_WS_SERVERURL:'"ws://119.27.184.157:9050/"',
  FS_SERVER_HOST: '"http://119.27.179.175:9800"'
})
