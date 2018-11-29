import request from '@/utils/request'

// 获取上传地址
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

