import request from '@/utils/request'

export function statistics(obj) {
  return request({
    url: '/ctireportcontroller/ctirecord',
    method: 'get',
    params: obj
  })
}

export function totalAgent(obj) {
  return request({
    url: '/ctireportcontroller/ctitotalagent',
    method: 'get',
    params: obj
  })
}

export function reportAgent(obj) {
  return request({
    url: '/ctireportcontroller/ctireportagent',
    method: 'get',
    params: obj
  })
}

export function oBTaskReportStatistics(obj) {
  return request({
    url: '/obreport/obtaskstatistics',
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
