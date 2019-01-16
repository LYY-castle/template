import request from '@/utils/request'
export function sendMessage(url, data) {
  return request({
    url: '/message/lingchuang/send',
    method: 'post',
    data: data
  })
}

