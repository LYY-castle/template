import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken, setToken } from '@/utils/auth'
// import qs from 'qs'
import router from '../router/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// 根据项目需求 是否统一拦截
// respone拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const authorization = response.headers.authorization
    if (typeof authorization !== 'undefined' && authorization !== '') {
      setToken(authorization)
    }
    const res = response.data
    if (res.code !== 20000) {
      if (res.code === '403') {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        router.replace({ path: '/login' })
      }
      return Promise.resolve(response)
    }
  },
  error => {
    console.log('err' + error)// for debug
    // if (error.response.status === 403) {
    //   Message({
    //     message: '没有权限',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // } else {
    //   Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    return Promise.reject(error)
  }
)

export default service
