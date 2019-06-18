const _ = require('lodash')

const prod_env = process.env.prod_env || 'dev'

const base_conf = {
  DEBUG: false,
  NODE_ENV: '"production"',
  BASE_API: '"/api/v1"',
  BASE_API_V2: '"/api/v2"',
  BUILT_IN_ROUTERS: {
    myNotification: '"/my_notification"',
    myDialTask: '"/my_dial_task"',
    wechatDial: '"/wechat_dial"',
    phoneMonitor: '"/phone_monitor"',
    orderManage: '"/order_manage"',
    qualityChecking: '"/quality_checking"', // 质检评分.
    contactRecordQuery: '"/contact_record_query"', // 接触历史查询.
    departManage: '"/depart_manage"',
    employeeManage: '"/employee_manage"',
    accountManage: '"/account_manage"'
  }
}

const env_conf = {
  dev: {
    TUI_WS_SERVERURL: '"ws://119.27.179.175:12010"',
    CTI_WS_SERVERURL: '"ws://119.27.184.157:9050/"',
    CTI_MONITOR_WS_SERVERURL: '"ws://119.27.184.157:9052/"',
    FILE_SERVER_URL: '"http://119.27.179.175:9800"',
    DEBUG: true,
    SHOW_WECHAT: true,
    SMS: {
      enable: true,
      platform: '1', // 1:网关，2：领创盛世.
      type: "4",//4大类营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"你好，谢谢支持"'
    },
    WORKFLOW_AUTH_STAFFNO: ['"10010"'],
  },
  sit: {
    TUI_WS_SERVERURL: '"ws://119.27.179.175:12123"',
    CTI_WS_SERVERURL: '"ws://119.27.184.157:9050/"',
    CTI_MONITOR_WS_SERVERURL: '"ws://119.27.184.157:9052/"',
    FILE_SERVER_URL: '"http://119.27.184.90:9800"',
    SHOW_WECHAT: true,
    SMS: {
      enable: false,
      platform: '1', // 1:网关，2：领创盛世.
      type: "4",//4大类营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"你好，谢谢支持"'
    },
    WORKFLOW_AUTH_STAFFNO: ['"10010"'],
  },
  jd: {
    TUI_WS_SERVERURL: '"ws://119.27.179.175:12502"',
    CTI_WS_SERVERURL: '"ws://132.232.209.250:9050/"',
    CTI_MONITOR_WS_SERVERURL: '"ws://132.232.209.250:9052/"',
    FILE_SERVER_URL: '"http://119.27.179.175:12501"',
    SHOW_WECHAT: true,
    SMS: {
      enable: false,
      platform: '1', // 1:网关，2：领创盛世.
      type: "4",//4大类营销短信
      sendMessageTime: 10,//通话多少秒需要发短信
      content: '"你好，谢谢支持"'
    },
    WORKFLOW_AUTH_STAFFNO: ['"10010"','"10021"'],
  }
}

module.exports = _.merge(base_conf, env_conf[prod_env])
