import request from '@/utils/request'

// 查询
export function queryBatch(req) {
  return request({
    url: `/batch/query`,
    method: 'get',
    params: req
  })
}
// 查询所有归属
export function findAscrislist() {
  return request({
    url: '/customer/getascrislist',
    method: 'get'
  })
}
// 查询失败详情
export function queryDetailById(batchId) {
  return request({
    url: `/batch/query_one`,
    method: 'get',
    params: { batchId: batchId }
  })
}
// 确认导入后请求数据
export function confirmimport(fileUrl, fileName) {
  return request({
    url: '/batch/validatefile',
    method: 'get',
    params: { 'fileUrl': fileUrl, 'fileName': fileName }
  })
}
// 修改批次
export function modifyBatch(req) {
  return request({
    url: '/batch/edit',
    method: 'get',
    params: req
  })
}
// 删除批次
export function delBatchById(batchId) {
  return request({
    url: '/batch/delete',
    method: 'get',
    params: batchId
  })
}
// 批量删除
export function delBatchs(batchIds) {
  return request({
    url: '/batch/batchdel',
    method: 'post',
    data: { batchIds: batchIds }
  })
}
// 确认导入
export function batchListimport(addReq) {
  return request({
    url: '/batch/confirmimport',
    method: 'post',
    data: addReq
  })
}

// 获取文件管理服务器预签名的上传地址
export function getUploadPath(bucketName, objectName) {
  return request({
    url: '/upload/presigned-put-url',
    method: 'get',
    params: {
      bucketName: bucketName,
      objectName: objectName
    }
  })
}
