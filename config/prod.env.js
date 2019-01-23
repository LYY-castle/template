const _ = require('lodash')

const prod_env = process.env.prod_env || 'dev'

const base_conf = {
  NODE_ENV: '"production"',
  BASE_API: '"/api/v1"',
}

const env_conf = {
  dev: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12010"',
    CTI_WS_SERVERURL:'"ws://119.27.179.175:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
    FILE_SERVER_URL: '"http://119.27.179.175:9800"',
    SHOW_WECHAT:true
  },
  master: {
    TUI_WS_SERVERURL:'"ws://52.83.140.209:8910"',
    CTI_WS_SERVERURL:'"ws://52.83.140.209:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://52.83.140.209:9052/"',
    FILE_SERVER_URL: '"http://52.83.140.209:9000"',
    SHOW_WECHAT:true
  },
  sit: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12133"',
    CTI_WS_SERVERURL:'"ws://132.232.209.250:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://132.232.209.250:9052/"',
    FILE_SERVER_URL: '"http://119.27.184.90:9800"',
    SHOW_WECHAT:true
  },
  loan: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12268"',
    CTI_WS_SERVERURL:'"ws://132.232.209.250:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://132.232.209.250:9052/"',
    FILE_SERVER_URL: '"http://119.27.179.175:12270"',
    SHOW_WECHAT:false
  },
  test: { // jindian.
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12088"',
    CTI_WS_SERVERURL:'"ws://119.27.179.175:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
    FILE_SERVER_URL: '"http://119.27.184.157:12078"',
    SHOW_WECHAT:true
  }
}

module.exports = _.merge(base_conf, env_conf[prod_env])
