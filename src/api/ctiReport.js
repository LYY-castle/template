import request from '@/utils/request'

export function statistics(obj) {
  return request({
    url: '/cti-report-controller/cti-record',
    method: 'get',
    params: obj
  })
}

export function totalAgent(obj) {
  return request({
    url: '/cti-report-controller/cti-total-agent',
    method: 'get',
    params: obj
  })
}

export function reportAgent(obj) {
  return request({
    url: '/cti-report-controller/cti-report-agent',
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

export function getAllStaffByDepartId(id) {
  return request({
    url: '/employee/getAllStaffByDepartId',
    method: 'get',
    params: { 'ids': id }
  })
}

export function getDepartId() {
  return request({
    url: '/login/getUserNameAndId',
    method: 'post'
  })
}
