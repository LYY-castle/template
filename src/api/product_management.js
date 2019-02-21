import request from '@/utils/request'
export function queryTemplateList(obj) {
  return request({
    url: '/product/queryProductList',
    method: 'get',
    params: obj
  })
}
export function createTemplateInfo(obj) {
  return request({
    url: '/product/createProduct',
    method: 'post',
    data: obj
  })
}
export function updateTemplateInfo(obj) {
  return request({
    url: '/product/updateProduct',
    method: 'post',
    data: obj
  })
}
export function deleteTemplateInfo(id) {
  return request({
    url: '/product/deleteProduct/' + id,
    method: 'post'
  })
}
export function queryTemplateInfo(id) {
  return request({
    url: '/product/queryProduct/' + id,
    method: 'get'
  })
}
export function deleteTemplateInfos(ids) {
  return request({
    url: '/product/deleteProducts/',
    method: 'post',
    data: ids
  })
}
export function queryProductTypes() {
  return request({
    url: '/product/queryProductTypes',
    method: 'get'
  })
}
export function modifyProductsStatus(req) {
  return request({
    url: '/product/products/status',
    method: 'post',
    data: req
  })
}
