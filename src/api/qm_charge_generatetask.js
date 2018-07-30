import request from '@/utils/request'

// 查询所有活动
export function queryAllCamps() {
  return request({
    url: 'campaign/getAllCamps',
    method: 'get'
  })
}
// 查询
export function queryTask(req) {
  return request({
    url: `quality/goquery`,
    method: 'get',
    params: req
  })
}
// 添加页面查询
export function findRecordsByConditions(req) {
  return request({
    url: 'quality/getRecordsByConditions',
    method: 'post',
    data: req
  })
}
// 添加质检任务
export function generateTask(req) {
  return request({
    url: 'quality/generateTask',
    method: 'post',
    data: req
  })
}
// 质检任务详情
export function queryoneByTaskId(req) {
  return request({
    url: 'quality/queryone',
    method: 'get',
    params: req
  })
}
// 修改质检任务 & 移除质检任务
export function modifytask(req) {
  return request({
    url: 'quality/modifytask',
    method: 'get',
    params: req
  })
}
// 删除质检任务
export function delTask(taskId) {
  return request({
    url: 'quality/deleteonetask',
    method: 'get',
    params: taskId
  })
}
// 批量删除
export function batchdel(taskIds) {
  return request({
    url: 'quality/batchdel',
    method: 'post',
    data: taskIds
  })
}
