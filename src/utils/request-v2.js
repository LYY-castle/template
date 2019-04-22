import _ from 'lodash'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken, setToken } from '@/utils/auth'
// import qs from 'qs'
import router from '../router/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API_V2, // api的base_url
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  if (!!config.params && _.isPlainObject(config.body)) {
    config.params = _.omitBy(config.params, (v) => {
      return _.isUndefined(v) || _.isNull(v)
    })
  }
  if (!!config.body && _.isPlainObject(config.body)) {
    config.body = _.omitBy(config.body, (v) => {
      return _.isUndefined(v) || _.isNull(v)
    })
  }
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
    const route = router.currentRoute
    if (res.code !== 20000) {
      if (res.code === '401') {
        if (route.fullPath === `/login`) {
          router.replace({ path: `/login` })
        } else {
          Message({
            message: res.message,
            type: 'error'
          })
          router.replace({ path: `/login` })
        }
      }
      return Promise.resolve(response)
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service
