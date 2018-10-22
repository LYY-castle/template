import request from '@/utils/request'

export function findAllOrganGet() {
  return request({
    url: '/organization/findAllOrgan',
    method: 'get'
  })
}

// // 连接老版portal用这个
// export function findAllOrganPost(obj) {
//   return request({
//     url: '/organization/findAllOrgan',
//     method: 'post',
//     data: obj
//   })
// }

export function findAllOrganPost(obj) {
  return request({
    url: '/organization/findAllOrgan',
    method: 'get',
    params: obj
  })
}

export function findAllOrganTo() {
  return request({
    url: '/organization/findAllOrganTo',
    method: 'get'
  })
}

export function queryDepts() {
  return request({
    url: '/employee/queryDepts',
    method: 'get'
  })
}

export function verifyDept(departId) {
  return request({
    url: '/organization/verifyDept',
    method: 'get',
    params: {
      departId: departId
    }
  })
}

export function modifyOrgan(obj) {
  return request({
    url: '/organization/modifyOrgan',
    method: 'post',
    data: obj
  })
}

export function modifyOrganStatus(obj) {
  return request({
    url: '/organization/modifyOrganStatus',
    method: 'post',
    data: obj
  })
}

export function delOrgan(obj) {
  return request({
    url: '/organization/delOrgan',
    method: 'post',
    data: obj
  })
}

export function addOrganization(obj) {
  return request({
    url: '/organization/addOrganization',
    method: 'post',
    data: obj
  })
}

export function delOrgansByOrganIds(obj) {
  return request({
    url: '/organization/delOrgansByOrganIds',
    method: 'post',
    data: obj
  })
}
