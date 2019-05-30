import request from '@/utils/request'
export function messageSendRecords(param) {
  return request({
    url: '/message/messageSendRecords',
    method: 'get',
    params: param
  })
}
export function sendMessage(sms) {
  return request({
    url: '/message/sendMessage',
    method: 'post',
    data: sms
  })
}
// 查询审核通过的短信模板
export function findTemplateList(obj) {
  return request({
    url: '/messageModule/findTemplateList',
    method: 'post',
    data: obj
  })
}
// 查询所有
export function getAllTemplateGroup() {
  return request({
    url: '/messageModule/getAllTemplateGroup',
    method: 'get'
  })
}
