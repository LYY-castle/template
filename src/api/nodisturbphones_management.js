import request from '@/utils/request'
// 条件查询免访号段
export function querynodisturbphones(req) {
  return request({
    url: '/nodisturb/querynodisturbphones',
    method: 'get',
    params: req
  })
}
// 根据Id查询免访号段
export function queryone(id) {
  return request({
    url: '/nodisturb/queryone',
    method: 'get',
    params: { 'id': id }
  })
}
// 新增免访号段
export function addNoDisturbZones(obj) {
  return request({
    url: '/nodisturb/addnodisturbzones',
    method: 'get',
    params: obj
  })
}
// 批量删除免访号段
export function batchdel(obj) {
  return request({
    url: '/nodisturb/batchdel',
    method: 'post',
    data: { 'novisitPhoneIds': obj }
  })
}
// 修改免访号段
export function eidtNoDisturbZones(obj) {
  return request({
    url: '/nodisturb/checkedit',
    method: 'post',
    data: obj
  })
}
// 删除免访号段
export function deleteone(id) {
  return request({
    url: '/nodisturb/deleteone',
    method: 'get',
    params: { 'novisitPhoneId': id }
  })
}
