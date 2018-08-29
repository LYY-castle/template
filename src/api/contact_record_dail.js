import request from '@/utils/request'

export function getDepartId() {
  return request({
    url: '/login/getUserNameAndId',
    method: 'post'
  })
}

export function getAllCamps() {
  return request({
    url: '/campaign/findCampaignByUser',
    method: 'get'
  })
}

export function queryByKeyWords(req) {
  return request({
    url: '/contact/getContactList',
    method: 'post',
    data: {
      campaigns: req.campaign,
      customerName: req.customerName,
      caller: req.caller,
      callee: req.callee,
      startTime: req.startTime,
      endTime: req.endTime,
      stime: req.stime,
      etime: req.etime,
      currentPage: req.pageNo,
      pageSize: req.pageSize,
      departId: req.departId,
      agentid: req.agentid,
      status: req.status === '-1' ? null : req.status

    }
  })
}
// 部门员工
export function getAllStaffByDepartId(id) {
  return request({
    url: '/employee/getAllStaffByDepartId',
    method: 'get',
    params: { 'ids': id }
  })
}
// 判断组接触历史权限
export function isHaveManager(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-depart-contact-record/GET',
    method: 'get'
  })
}
// 判断人接触历史权限
export function isHaveStaff(id) {
  return request({
    url: '/auth/users/' + id + '/perms/-staff-contact-record/GET',
    method: 'get'
  })
}

// 详情页面请求
// 得到小结
export function getSummariesByTaskId(id) {
  return request({
    url: '/dialtask/getSummariesByTaskId',
    method: 'get',
    params: { 'taskId': id }
  })
}
// 查询接触历史
export function getContactByGradeId(id) {
  return request({
    url: '/contact/getContactByGradeId',
    method: 'get',
    params: { 'recordId': id }
  })
}
// 查询接触历史
export function queryrecordbytaskid(taskId, campaignId) {
  return request({
    url: '/dialtask/queryrecordbytaskid',
    method: 'get',
    params: { 'taskId': taskId, 'campaignId': campaignId }
  })
}
// 员工信息
export function getStaffNameByAgentId(id) {
  return request({
    url: '/employee/getStaffNameByAgentId',
    method: 'get',
    params: { 'agentId': id }
  })
}
// 查询拨打
export function queryTaskByTaskId(id) {
  return request({
    url: '/dialtask/queryone',
    method: 'get',
    params: { 'taskId': id }
  })
}
// 查询订单
export function queryOrderByTaskId(id) {
  return request({
    url: '/order/queryone',
    method: 'get',
    params: { 'taskId': id }
  })
}
// 查询订单
export function querycustomerbyid(id) {
  return request({
    url: '/customer/querycustomerbyid',
    method: 'get',
    params: { 'customerId': id }
  })
}
// 修改任务状态
export function updateTaskStatus(taskId, taskStatus, appointTime) {
  return request({
    url: '/dialtask/updateTaskStatus',
    method: 'post',
    data: { 'taskId': taskId, 'status': taskStatus, 'appointTime': appointTime }
  })
}
// 修改小结 与 备注
export function generateRecord(recordId, nodules, description) {
  return request({
    url: '/dialtask/generateRecord',
    method: 'post',
    data: { 'recordId': recordId, 'nodules': nodules, 'noduledesc': description }
  })
}
// 查询订单
export function quertOrderDetail(id) {
  return request({
    url: '/order/quertDetail',
    method: 'get',
    params: { 'orderId': id }
  })
}
