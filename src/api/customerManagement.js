import request from '@/utils/request'

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
    data: req
  })
}
// 添加客户
export function addCustomer(req) {
  return request({
    url: `/customer/addcustomer`,
    method: 'post',
    data: req
  })
}
// 批量删除
export function batchDelCustomer(req) {
  return request({
    url: `/customer/batchdelete`,
    method: 'post',
    data: { customerIds: req }
  })
}
