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
    FS_SERVER_HOST: '"http://119.27.179.175:9800"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
    MINIO_URL:'"http://119.27.179.175:9800/crm"',
  },
  master: {
    TUI_WS_SERVERURL:'"ws://52.83.140.209:8910"',
    CTI_WS_SERVERURL:'"ws://52.83.140.209:9050/"',
    FS_SERVER_HOST: '"http://52.83.140.209:9000"',
    CTI_MONITOR_WS_SERVERURL:'"ws://52.83.140.209:9052/"',
    MINIO_URL:'"http://52.83.140.209:9000/crm"',
  },
  sit: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12012"',
    CTI_WS_SERVERURL:'"ws://119.27.184.157:9050/"',
    FS_SERVER_HOST: '"http://119.27.179.175:9800"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.184.157:9052/"',
    MINIO_URL:'"http://119.27.179.175:9800/crm"',
  },
  loan: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12268"',
    CTI_WS_SERVERURL:'"ws://132.232.209.250:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://132.232.209.250:9052/"',
    FS_SERVER_HOST: '"http://119.27.179.175:12270"',
    MINIO_URL:'"http://119.27.179.175:12270/crm"',
  }
}

module.exports = _.merge(base_conf, env_conf[prod_env])
