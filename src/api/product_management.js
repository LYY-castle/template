import request from '@/utils/request'
export function queryProductList(obj) {
  return request({
    url: '/productServer/queryProductList',
    method: 'get',
    params: obj
  })
}
export function createProductInfo(obj) {
  return request({
    url: '/productServer/createProductInfo',
    method: 'post',
    data: obj
  })
}
export function updateProductInfo(obj) {
  return request({
    url: '/productServer/updateProductInfo',
    method: 'post',
    data: obj
  })
}
export function deleteProductInfo(id) {
  return request({
    url: '/productServer/deleteProductInfo/' + id,
    method: 'post'
  })
}
export function queryProductInfo(id) {
  return request({
    url: '/productServer/queryProductInfo/' + id,
    method: 'get'
  })
}
export function deleteProductInfos(ids) {
  return request({
    url: '/productServer/deleteProductInfo/',
    method: 'post',
    data: ids
  })
}
export function queryProductTypes() {
  return request({
    url: '/productServer/queryProductTypes',
    method: 'get'
  })
}
