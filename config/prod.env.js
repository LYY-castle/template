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
    FS_SERVER_HOST: '"http://119.27.179.175:9800"',
    MINIO_URL:'"http://119.27.179.175:9800/crm"',
    SHOW_WECHAT:true,
    SMS: {
      platform: '1', // 1:网关，2：领创盛世.
      type: "3",//3为营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"【测试短信】内容（测试发送短信功能）,退订回T"'
    }
  },
  master: {
    TUI_WS_SERVERURL:'"ws://52.83.140.209:8910"',
    CTI_WS_SERVERURL:'"ws://52.83.140.209:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://52.83.140.209:9052/"',
    FS_SERVER_HOST: '"http://52.83.140.209:9000"',
    MINIO_URL:'"http://52.83.140.209:9000/crm"',
    SHOW_WECHAT:true,
    SMS: {
      platform: '1', // 1:网关，2：领创盛世.
      type: "3",//3为营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"【测试短信】内容（测试发送短信功能）,退订回T"'
    }
  },
  sit: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12012"',
    CTI_WS_SERVERURL:'"ws://119.27.184.157:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.184.157:9052/"',
    FS_SERVER_HOST: '"http://119.27.179.175:9800"',
    MINIO_URL:'"http://119.27.179.175:9800/crm"',
    SHOW_WECHAT:false,
    SMS: {
      platform: '1', // 1:网关，2：领创盛世.
      type: "3",//3为营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"【测试短信】内容（测试发送短信功能）,退订回T"'
    }
  },
  loan: {
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12268"',
    CTI_WS_SERVERURL:'"ws://132.232.209.250:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://132.232.209.250:9052/"',
    FS_SERVER_HOST: '"http://119.27.179.175:12270"',
    MINIO_URL:'"http://119.27.179.175:12270/crm"',
    SHOW_WECHAT:false,
    SMS: {
      platform: '1', // 1:网关，2：领创盛世.
      type: "3",//3为营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"【测试短信】内容（测试发送短信功能）,退订回T"'
    }
  },
  test: { // jindian.
    TUI_WS_SERVERURL:'"ws://119.27.179.175:12088"',
    CTI_WS_SERVERURL:'"ws://119.27.179.175:9050/"',
    CTI_MONITOR_WS_SERVERURL:'"ws://119.27.179.175:9052/"',
    FS_SERVER_HOST: '"http://119.27.184.157:12078"',
    MINIO_URL:'"http://119.27.184.157:12078/crm"',
    SHOW_WECHAT:true,
    SMS: {
      platform: '1', // 1:网关，2：领创盛世.
      type: "3",//3为营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"【测试短信】内容（测试发送短信功能）,退订回T"'
    }
  }
}

module.exports = _.merge(base_conf, env_conf[prod_env])
