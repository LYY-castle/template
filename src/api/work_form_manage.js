import requestV2 from '@/utils/request-v2'
// 获取工作表单列表数据
export function getWorkForm() {
  return requestV2({
    url: '/workflow/workform/query/workformList',
    method: 'get',
  })
}


