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
  },
  master: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12207/tui"',
    CTI_WS_SERVERURL:'"ws://119.27.179.175:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
  },
  sit: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12012/tui"',
    CTI_WS_SERVERURL:'"ws://119.27.184.157:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.184.157:9052/"',
  }
}

module.exports = _.merge(base_conf, env_conf[prod_env])
