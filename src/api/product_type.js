import request from '@/utils/request'
// 多条件查找产品类型详情
export function queryProductTypeList(obj) {
  return request({
    url: '/product/queryProductTypeList',
    method: 'get',
    params: obj
  })
}
// 根据产品类型id查找产品类型详情
export function queryProductType(obj) {
  return request({
    url: '/product/queryProductType',
    method: 'get',
    params: obj
  })
}
// 增加产品类型
export function addProductType(obj) {
  return request({
    url: '/product/addProductType',
    method: 'post',
    data: obj
  })
}
// 单个删除产品类型
export function deleteProductType(obj) {
  return request({
    url: '/product/deleteProductType',
    method: 'post',
    data: obj
  })
}
// 批量删除产品类型
export function deleteProductTypes(obj) {
  return request({
    url: '/product/deleteProductTypes',
    method: 'post',
    data: obj
  })
}
// 修改产品类型
export function editProductType(obj) {
  return request({
    url: '/product/editProductType',
    method: 'post',
    data: obj
  })
}

