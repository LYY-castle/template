'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api/v1"',
  // BASE_API: '"http://localhost:9091"',
  TUI_WS_SERVERURL:'"ws://119.27.179.175:12010"',
  FS_SERVER_HOST: '"http://119.27.179.175:9800"',
  CTI_WS_SERVERURL:'"ws://119.27.179.175:9050/"',
  CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
  MINIO_URL:'"http://119.27.179.175:9800/crm"',
  SHOW_WECHAT:true
})
