import request from '@/utils/request'
// import qs from 'qs'

export function getMenu() {
  return request({
    url: '/login/getMenu',
    method: 'post'
  })
}

export function checkPerm() {
  return request({
    url: '/login/checkPerm',
    method: 'post'
  })
}

export function findContactHistory() {
  return request({
    url: '/contact/findContactHistory',
    method: 'get'
  })
}
// 查询
export function queryByCustomer(req) {
  return request({
    url: `/customer/querybycustomer`,
    method: 'get',
    params: req
  })
}
// 修改时查询客户详情
export function queryByCustomerId(req) {
  return request({
    url: `/customer/querycustomerbyid`,
    method: 'get',
    params: req
  })
}
// 删除客户
export function delCustomer(req) {
  return request({
    url: `/customer/deletecustomer`,
    method: 'get',
    params: req
  })
}
// 修改客户详情
export function editCustomer(req) {
  return request({
    url: `/customer/editcustomer`,
    method: 'post',
    params: req
  })
}
// 添加客户
export function addCustomer(req) {
  return request({
    url: `/customer/addcustomer`,
    method: 'post',
    params: req
  })
}
// 批量删除
export function batchDelCustomer(req) {
  return request({
    url: `/customer/batchdelete`,
    method: 'post',
    data: { customerIds: req.join(',') }
  })
}
