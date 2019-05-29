import requestV2 from '@/utils/request-v2'
// 获取工作表单列表数据
export function getWorkForm() {
  return requestV2({
    url: '/workflow/workformList',
    method: 'get',
  })
}
// 新建
export function createWorkForm(obj) {
  return requestV2({
    url: '/workflow/workforms',
    method: 'post',
    data: obj
  })
}
export function updateWorkForm(obj) {
  return requestV2({
    url: '/workflow/workforms',
    method: 'put',
    data: obj
  })
}
// 批量设置工作表单
export function setWorkForm(obj) {
  return requestV2({
    url: '/workflow/workform/enabled/workform',
    method: 'post',
    data: obj
  })
}

// 查看工作表单
export function queryWorkForm(id,version,code) {
  return requestV2({
    url: '/workflow/workform/query/workform',
    method: 'get',
    params: {
      id,
      version,
      code
    }
  })
}

// 单个删除批量删除
export function deleteWorkForm(workFormId) {
  return requestV2({
    url: '/workflow/workform',
    method: 'post',
    data: {
      id:workFormId
    }
  })
}

// 省市区三级联动
// 根据地区级别查询地区
export function getAddress(level){
  return requestV2({
    url:'/customer/region/level',
    method:'get',
    params:{
      regionLevel:level
    }
  })
}
// 根据父亲ID查询下级
export function getLowerAddress(regionParentId){
  return requestV2({
    url:'/customer/region/parentId',
    method:'get',
    params:{
      regionParentId
    }
  })
}



