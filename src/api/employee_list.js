import request from '@/utils/request'

export function queryDepts() {
  return request({
    url: '/employee/queryDepts',
    method: 'get'
  })
}

// 获取所有可见部门
export function getAllVisibleDepts() {
  return request({
    url: '/organization/findAllOrganTo',
    method: 'get'
  })
}

export function query(page) {
  return request({
    url: '/employee/query',
    method: 'get',
    params: page
  })
}

export function queryUserSkillSet(page) {
  return request({
    url: '/employee/querySkillSet',
    method: 'get',
    params: page
  })
}

export function queryUserSkillSetByDepart(page) {
  return request({
    url: '/employee/querySkillSetByDepartId',
    method: 'get',
    params: page
  })
}

export function deleteStaff(id) {
  return request({
    url: '/employee/delete',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function deleteAllStaff(arr) {
  return request({
    url: '/employee/batch_del',
    method: 'post',
    data: {
      listId: arr
    }
  })
}

export function queryone(id) {
  return request({
    url: '/employee/queryone',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function edit(obj) {
  return request({
    url: '/employee/edit',
    method: 'post',
    data: {
      id: obj.id,
      name: obj.name,
      origin: JSON.stringify(obj.origin),
      idNumber: obj.idNumber,
      sex: obj.sex,
      birthday: obj.birthday,
      hiredate: obj.hiredate,
      departId: obj.departId,
      phone: obj.phone,
      modifier: localStorage.getItem('agentName'),
      modifierId: localStorage.getItem('agentId')
    }
  })
}

export function addStaff(req) {
  // 这个很特殊  后台不接收 只能接受字符串 需特殊转换一下 其实只需要将req整体迁移下去即可（留给自己的备注）
  return request({
    url: '/employee/add',
    method: 'post',
    data: {
      name: req.staffName,
      origin: JSON.stringify(req.origin),
      idNumber: req.idNumber,
      sex: req.sex,
      hiredate: req.hiredate,
      birthday: req.birthday,
      departId: req.departId,
      phone: req.userPhone,
      creatorId: localStorage.getItem('agentId'),
      creator: localStorage.getItem('agentName')

    }
  })
}
export function getStaffNameByAgentId(req) {
  return request({
    url: '/employee/getStaffNameByAgentId',
    method: 'get',
    params: req

  })
}
