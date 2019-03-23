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
export function queryByCustomerId(req, num) {
  return request({
    url: `/customer/querycustomerbyid`,
    method: 'get',
    params: {
      customerId: req,
      num: num
    }
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
export function addCustomer(map) {
  return request({
    url: `/customer/addcustomer`,
    method: 'post',
    data: map
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

export function getSupportedTags() {
  return request({
    url: `/customer/getsupportedtags`,
    method: 'get'
  })
}

export function setIsSelected(obj) {
  return request({
    url: `/customer/setselectstatus`,
    method: 'post',
    data: obj
  })
}

export function uploadFileandImport(obj) {
  return request({
    url: `/customer/upload`,
    method: 'post',
    data: obj
  })
}
// 查询地区
export function getRegion(req) {
  return request({
    url: `/customer/regioninfo`,
    params: { 'parentId': req }
  })
}

// 删除一条地址信息
export function deleteAddress(addressId) {
  return request({
    url: `/customer/deleteaddress/` + addressId,
    method: 'get'
  })
}

// 删除一条联系信息
export function deleteLink(linkId) {
  return request({
    url: `/customer/deletelink/` + linkId,
    method: 'get'
  })
}

// 删除一条联系信息
export function deleteCar(carinfoId) {
  return request({
    url: `/customer/deletecar/` + carinfoId,
    method: 'get'
  })
}

// 名单抽取-------------
// 查询所有批次
export function getAllBatch() {
  return request({
    url: `/customer/batch/all`
  })
}

// 查询所有字段名
export function getAllField() {
  return request({
    url: `/customer/template/all`
  })
}

// 查询符合的数量
export function getFiltercustomers(req) {
  return request({
    url: `/customer/filtercustomers`,
    method: 'post',
    data: req
  })
}

// 确认生成名单
export function addGenerate(req) {
  return request({
    url: `/nameList/generate`,
    method: 'post',
    data: req
  })
}
