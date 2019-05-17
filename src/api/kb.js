import request from '@/utils/request'
import requestV2 from '@/utils/request-v2'

// 查询所有节点列表
export function getCatalogs() {
  return request({
    url: 'kb/query/catalogs'
  })
}

// 新建节点
export function addCatalogs(obj) {
  return request({
    url: 'kb/add/catalogs',
    method: 'post',
    data: obj
  })
}

// 删除节点
export function delCatalogs(obj) {
  return request({
    url: 'kb/delete/catalogs/' + obj.ID,
    method: 'post'
  })
}

// 编辑节点
export function editCatalogs(id, obj) {
  return request({
    url: 'kb/update/catalogs/' + id,
    method: 'post',
    data: obj
  })
}

// 查询目录下文章
export function getArticlesById(id, obj) {
  return request({
    url: `/kb/query/catalogs/${id}/articles`,
    params: obj
  })
}

// 普通查询
export function getArticles1(obj) {
  return request({
    url: '/kb/query/articles',
    params: obj
  })
}

// 高级查询
export function getArticles2(obj) {
  return request({
    // url: `/kb/search/articles?query="${obj.query}"&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
    url: '/kb/search/articles',
    params: obj
  })
}

// 查询文章内容
export function getArticlesDetail(articleId) {
  return request({
    url: '/kb/query/articles/' + articleId
  })
}

// 新增文章
export function addArticles(id, obj) {
  return request({
    url: '/kb/add/catalogs/' + id + '/article',
    method: 'post',
    data: obj
  })
}

// 修改文章
export function editArticles(id, obj) {
  return request({
    url: '/kb/update/articles/' + id,
    method: 'post',
    data: obj
  })
}

// 删除文章
export function delArticles(delReq) {
  return request({
    url: '/kb/delete/catalogs/' + delReq.catalogid + '/articles/' + delReq.articleid,
    method: 'post'
  })
}

// 给文章添加链接
export function addArticlesLink(obj) {
  return request({
    url: '/kb/update/articles/link/',
    method: 'post',
    data: obj
  })
}

// 获取上传路径
export function getUploadInfo(obj) {
  return request({
    url: '/upload/presigned-put-url',
    params: obj
  })
}

// 删除已上传的附件
export function delUpload(obj) {
  return request({
    url: `/upload/remove-object?bucketName=crm&objectName=${obj.objectName}`,
    method: 'post'
  })
}

// 审核
export function approvalArticles(obj) {
  return requestV2({
    url: '/kb/approval/article',
    method: 'post',
    data: obj
  })
}
