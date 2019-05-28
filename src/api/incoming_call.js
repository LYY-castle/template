import request from '@/utils/request'
import request_v2 from '@/utils/request-v2'

// 通过呼入主叫号码查询客户信息
export function getCustomerInfoByPhone(phone) {
  return request_v2({
    url: '/customer/basic/customerinfo?customerPhone=' + phone
  })
}
// 查询接触历史
export function getContactList(req) {
  return request_v2({
    url: '/contact/record/contactRecordList',
    params: req
  })
}
// 查询呼入小结
export function getSummary() {
  return request({
    url: '/nodule/callinsummaries'
  })
}
// 查询号码归属地
export function getPhoneAddress(phone) {
  return request_v2({
    url: '/customer/phoneAddress/query/phone/address',
    params: { 'phone': phone }
  })
}
// 查询所有服务目录
export function getServiceList() {
  return request_v2({
    url: '/workflow/servicemenu/getList'
  })
}
// 创建工单记录
export function addWorkFormRecord(data) {
  return request_v2({
    url: '/workflow/workformRecords',
    method: 'post',
    data: data
  })
}
// 查询工单记录列表
export function getWorkFormRecord(req) {
  return request_v2({
    url: '/workflow/workformRecords',
    method: 'get',
    params: req
  })
}
// 查询工单记录详情
export function getWorkFormRecordDetail(id) {
  return request_v2({
    url: `/workflow/workformRecord/${id}`,
    method: 'get'
  })
}
// 通过id查询工单模板
export function getWorkFormTempById(id) {
  return request_v2({
    url: '/workflow/workform',
    method: 'get',
    params: { 'id': id }

  })
}
// 通过工单模板id重发短信
export function reSendMsg(id) {
  return request_v2({
    url: `/workflow/workformRecord/reSendMsg/${id}`,
    method: 'patch'
  })
}
// 修改接触记录小结和备注信息
export function recordSummaryInfo(data) {
  return request_v2({
    url: '/contact/record/recordSummaryInfo',
    method: 'post',
    data: data
  })
}
