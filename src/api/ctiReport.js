import request from '@/utils/request'

export function statistics(obj) {
  return request({
    url: '/ctiReportController/ctiRecordStatistics',
    method: 'get',
    params: obj
  })
}

