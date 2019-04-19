import request from '@/utils/request'
// 查询所有外呼状态
export function getPhoneStatus() {
  return request({
    url: '/phonestatus/allstatus',
    method: 'get'
  })
}
// 添加外呼状态
export function addPhoneStatus(obj) {
  return request({
    url: '/phonestatus/add',
    method: 'post',
    data: obj
  })
}
// 修改外呼状态
export function editPhoneStatus(obj) {
  return request({
    url: '/phonestatus/update',
    method: 'post',
    data: obj
  })
}
// 删除外呼状态
export function deletePhoneStatus(id) {
  return request({
    url: '/phonestatus/delete',
    method: 'get',
    params: { 'id': id }
  })
}
