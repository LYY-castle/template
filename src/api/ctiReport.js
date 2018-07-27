import request from '@/utils/request'

export function statistics(obj) {
  return request({
    url: '/ctiReportController/ctiRecordStatistics',
    method: 'get',
    params: obj
  })
}

export function oBTaskReportStatistics(obj) {
  return request({
    url: '/ob-report/ob-task-statistics',
    method: 'get',
    params: obj
  })
}
