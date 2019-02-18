import request from '@/utils/request'
export function queryTemplateList(obj) {
  return request({
    url: '/productServer/queryTemplateList',
    method: 'get',
    params: obj
  })
}
export function createTemplateInfo(obj) {
  return request({
    url: '/productServer/createTemplateInfo',
    method: 'post',
    data: obj
  })
}
export function updateTemplateInfo(obj) {
  return request({
    url: '/productServer/updateTemplateInfo',
    method: 'post',
    data: obj
  })
}
export function deleteTemplateInfo(id) {
  return request({
    url: '/productServer/deleteTemplateInfo/' + id,
    method: 'post'
  })
}
export function queryTemplateInfo(id) {
  return request({
    url: '/productServer/queryTemplateInfo/' + id,
    method: 'get'
  })
}
export function deleteTemplateInfos(ids) {
  return request({
    url: '/productServer/deleteTemplateInfo/',
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
export function modifyProductsStatus(req) {
  return request({
    url: '/productServer/products/status',
    method: 'post',
    data: req
  })
}
