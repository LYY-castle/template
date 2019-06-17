'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  DEBUG: true,
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:9091"',
  // BASE_API_V2: '"http://localhost:9091/api/v2"',
  BASE_API: '"http://119.27.179.175:8111/portal"',
  BASE_API_V2: '"http://119.27.179.175:8111/portal/api/v2"',
  TUI_WS_SERVERURL: '"ws://119.27.179.175:12010"',
  CTI_WS_SERVERURL: '"ws://119.27.184.157:9050/"',
  CTI_MONITOR_WS_SERVERURL: '"ws://119.27.184.157:9052/"',
  FILE_SERVER_URL: '"http://119.27.179.175:9800"',
  SHOW_WECHAT: true,
  SMS: {
    enable: true,
    platform: '1', // 1:网关，2：领创盛世.
    type: "4",//4大类营销短信
    sendMessageTime: 10,//通话多少秒需要发短信
    content: '"你好，谢谢支持"'
  },
  WORKFLOW_AUTH_STAFFNO: ['10010']
})
