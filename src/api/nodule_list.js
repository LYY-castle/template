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
// 删除小结
export function delNoduleByNoduleId(noduleId) {
  return request({
    url: 'nodule/delNoduleByNoduleId',
    method: 'post',
    data: noduleId
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
