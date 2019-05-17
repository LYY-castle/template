import requestV2 from '@/utils/request-v2'
// 获取工作表单列表数据
export function getWorkForm() {
  return requestV2({
    url: '/workflow/workform/query/workformList',
    method: 'get',
  })
}
// 新建
export function createWorkForm(obj) {
  return requestV2({
    url: '/workflow/workform/create/workform',
    method: 'post',
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
    url: '/workflow/workform/delete/workform',
    method: 'post',
    data: {
      id:workFormId
    }
  })
}



