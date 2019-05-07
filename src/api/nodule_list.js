import request from '@/utils/request'

// 查询
export function findNoduleByInfo(req) {
  return request({
    url: `nodule/findNoduleByInfo`,
    method: 'post',
    data: req
  })
}
// 小结详情
export function findNoduleByNoduleId(noduleId) {
  return request({
    url: 'nodule/findNoduleByNoduleId',
    method: 'post',
    data: noduleId
  })
}
// 添加小结
export function addNodule(req) {
  return request({
    url: 'nodule/addNodule',
    method: 'post',
    data: req
  })
}
// 修改小结
export function editNodule(req) {
  return request({
    url: 'nodule/editNodule',
    method: 'post',
    data: req
  })
}
// 修改小结标题
export function editNoduleTitle(req) {
  return request({
    url: 'nodule/editNoduleTitle',
    method: 'post',
    data: req
  })
}
// 修改小结内容
export function editNoduleItem(req) {
  return request({
    url: 'nodule/editNoduleItem',
    method: 'post',
    data: req
  })
}
// 增加一条小结内容
export function addNoduleOneItem(req) {
  return request({
    url: 'nodule/addNoduleOneItem',
    method: 'post',
    data: req
  })
}
// 修改一条小结内容
export function editNoduleOneItem(req) {
  return request({
    url: 'nodule/editNoduleOneItem',
    method: 'post',
    data: req
  })
}
// 删除小结
export function delNoduleByNoduleId(noduleId) {
  return request({
    url: 'nodule/delNoduleByNoduleId',
    method: 'post',
    data: noduleId
  })
}
// 删除小结详情
export function delOneNoduleById(id) {
  return request({
    url: 'nodule/delOneNoduleById',
    method: 'post',
    data: id
  })
}
// 批量删除小结
export function delNodulesByNoduleIds(noduleIds) {
  return request({
    url: 'nodule/delNodulesByNoduleIds',
    method: 'post',
    data: noduleIds
  })
}
// 查询通用呼出小结前两级
export function getBasicCallOutSummaries() {
  return request({
    url: `/nodule/calloutsummaries`,
    method: 'get'
  })
}
// 查询通用呼入小结前两级
export function getBasicCallInSummaries() {
  return request({
    url: `/nodule/callinsummaries`,
    method: 'get'
  })
}
