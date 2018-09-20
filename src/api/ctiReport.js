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

export function obstatistics(obj) {
  return request({
    url: '/obreport/departOrStaff/statistics',
    method: 'get',
    params: obj
  })
}

export function obtotalAgent(obj) {
  return request({
    url: '/obreport/agent/total/statistics',
    method: 'get',
    params: obj
  })
}

export function obreportAgent(obj) {
  return request({
    url: '/obreport/agent/statistics',
    method: 'get',
    params: obj
  })
}

export function orderstatistics(obj) {
  return request({
    url: '/orderReport/departOrStaff/statistics',
    method: 'get',
    params: obj
  })
}

export function ordertotalAgent(obj) {
  return request({
    url: '/orderReport/agent/total/statistics',
    method: 'get',
    params: obj
  })
}

export function orderreportAgent(obj) {
  return request({
    url: '/orderReport/agent/statistics',
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

export function departAgents(id) {
  return request({
    url: '/orderReport/departAgents',
    method: 'get',
    params: { 'depart_id': id }
  })
}
