import request from '@/utils/request'

// 查询质检活动 查询下属所有活动时传入campaignId
export function findQmCampaignByUser(campaignId) {
  return request({
    url: 'qualityTask/findQmCampaignByUser',
    params: campaignId
  })
}
// 查询质检评分表
export function findAllGradeForm(pageSize) {
  return request({
    url: 'grade/findAllGradeForm',
    params: pageSize
  })
}
// 查询质检评分
export function findQualityResultByInfo(req) {
  return request({
    url: 'quality/findQualityResultByInfo',
    method: 'post',
    data: req
  })
}
// 通过员工id查找部门
export function getDepartIdByAgentId(agentId) {
  return request({
    url: 'employee/getStaffNameByAgentId',
    params: { 'agentId': agentId }
  })
}
// 判断现场主管查询质检评分权限
export function checkPromission_charge(id) {
  return request({
    // url: `auth/users/${agentId}/perms/-depart-quality-mark/GET`
    url: '/auth/users/' + id + '/perms/-depart-/GET'
  })
}
// 判断坐席查询质检评分权限
export function checkPromission_sit(id) {
  return request({
    // url: `auth/users/${agentId}/perms/-staff-quality-mark/GET`
    url: '/auth/users/' + id + '/perms/-staff-/GET'
  })
}
// 判断质检主管查询质检评分权限
export function checkPromission_qs(id) {
  return request({
    // url: `auth/users/${agentId}/perms/-qc-depart-quality-mark/GET`
    url: '/auth/users/' + id + '/perms/-qc-depart-/GET'
  })
}
// 判断质检员查询质检评分权限
export function checkPromission_qc(id) {
  return request({
    // url: `auth/users/${agentId}/perms/-qc-staff-quality-mark/GET`
    url: '/auth/users/' + id + '/perms/-qc-staff-/GET'
  })
}
// 通过员工ID查找部门
export function getStaffNameByAgentId(agentId) {
  return request({
    url: 'employee/getStaffNameByAgentId',
    params: { 'agentId': agentId }
  })
}
// --------------------质检评分详情----------------------
//
