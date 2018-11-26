import request from '@/utils/request'

export function categoriesCreate(obj) {
  return request({
    url: '/categories/create',
    method: 'post',
    data: obj
  })
}

export function categoriesEdit(category_id, obj) {
  return request({
    url: '/categories/edit/' + category_id,
    method: 'post',
    data: obj
  })
}

export function categoriesQuery(obj) {
  return request({
    url: '/categories/query/list',
    method: 'get',
    params: obj
  })
}

export function categoriesDelete(category_id) {
  return request({
    url: '/categories/delete/' + category_id,
    method: 'post',
    data: {}
  })
}

export function categoriesSpecific(category_id) {
  return request({
    url: '/categories/' + category_id,
    method: 'get'
  })
}

export function categoriesBatchDelete(obj) {
  return request({
    url: '/categories/batch_delete?category_ids=' + obj.category_ids,
    method: 'post',
    data: {}
  })
}

export function categoriesBatchEnable(obj) {
  return request({
    url: '/categories/batch_enable_disable?category_ids=' + obj.category_ids + '&enabled=' + obj.enabled,
    method: 'post',
    data: {}
  })
}
