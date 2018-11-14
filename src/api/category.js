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

export function categories() {
  return request({
    url: '/categories/query/list',
    method: 'get'
  })
}

export function categoriesNext(obj) {
  return request({
    url: '/categories?category_id=' + obj.category_id + '&code=' + obj.code,
    method: 'get'
  })
}

export function categoriesOne(category_id) {
  return request({
    url: '/categories/' + category_id,
    method: 'get'
  })
}

export function categoriesDelete(category_id, obj) {
  return request({
    url: '/categories/delete/' + category_id,
    method: 'post'
  })
}
