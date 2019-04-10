
import request from '@/utils/request'

// 权限
export function getPermission(id) {
  return request({
    url: `auth/users/${id}/perms/-kb-update/POST`
  })
}

// 查询所有节点列表
export function getCatalogs() {
  return request({
    url: '/kb/catalog/tree'
  })
}

// 查询目录下文章
export function getArticlesById(id) {
  return request({
    url: `/kb/catalog/article?id=${id}`
  })
}

// 查询
export function getArticles(obj) {
  return request({
    url: '/kb/article/search',
    params: obj
  })
}

// 查询文章内容
export function getArticlesDetail(articleId) {
  return request({
    url: '/kb/query/articles/' + articleId
  })
}

