import request from '@/utils/request'

export function getListReport(req) {
  return request({
    url: '/obreport/nameListReport',
    method: 'get',
    params: req
  })
}
