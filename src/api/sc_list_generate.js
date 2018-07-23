import request from '@/utils/request'

// 查询
export function queryNamelist(req) {
  return request({
    url: `/customer/namelist`,
    method: 'get',
    params: req
  })
}
// 查询名单详情
export function queryByListId(req) {
  return request({
    url: `/customer/queryone`,
    method: 'get',
    params: req
  })
}
// 删除客户
export function delList(req) {
  return request({
    url: `/customer/delone`,
    method: 'get',
    params: req
  })
}
// 修改名单
export function editNamelist(req) {
  return request({
    url: `/customer/editone`,
    method: 'post',
    data: req
  })
}
// 添加名单
export function addNamelist(req) {
  return request({
    url: `/customer/generatelist`,
    method: 'post',
    data: req
  })
}
// 批量删除
export function batchDelList(req) {
  return request({
    url: `/customer/batchdel`,
    method: 'get',
    params: { idlist: req.join(',') }
  })
}
