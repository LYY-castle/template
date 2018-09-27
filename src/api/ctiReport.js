import request from '@/utils/request'
import _ from 'lodash'

export function statistics(obj) {
  return request({
    url: '/ctireportcontroller/ctirecord',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function totalAgent(obj) {
  return request({
    url: '/ctireportcontroller/ctitotalagent',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function reportAgent(obj) {
  return request({
    url: '/ctireportcontroller/ctireportagent',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function obstatistics(obj) {
  return request({
    url: '/obreport/departOrStaff/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function obtotalAgent(obj) {
  return request({
    url: '/obreport/agent/total/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function obreportAgent(obj) {
  return request({
    url: '/obreport/agent/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function orderstatistics(obj) {
  return request({
    url: '/orderReport/departOrStaff/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function ordertotalAgent(obj) {
  return request({
    url: '/orderReport/agent/total/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
  })
}

export function orderreportAgent(obj) {
  return request({
    url: '/orderReport/agent/statistics',
    method: 'get',
    params: _.omitBy(obj, (v) => {
      return _.trim(v) === ''
    })
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
