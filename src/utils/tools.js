import request from '@/utils/request'
import moment from 'moment'
export function formatDateTime(inputTime) {
  if (inputTime) {
    var date = new Date(inputTime)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  } else {
    return ''
  }
}

export function formatDate(inputTime) {
  if (inputTime) {
    var date = new Date(inputTime)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  } else {
    return ''
  }
}

// 手机号码加密
export function hideMobile(mobileNo) {
  if (mobileNo) {
    return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
  }
}

// 身份证号码加密
export function hideIdNumber(idNumber) {
  if (idNumber) {
    return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
  }
}

export function checkNo(value) {
  const reg = /^[1-9]\d*$/
  if (value) {
    if (value > 999999 || new RegExp(reg).test(value) === false) {
      setTimeout(() => {
        value = ''
      }, 500)
    }
  }
}

export function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy2 = []
    for (var i = 0; i < obj.length; i++) {
      copy2[i] = clone(obj[i])
    }
    return copy2
  }

  // Handle Objects
  if (obj instanceof Object) {
    var copy3 = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy3[attr] = clone(obj[attr])
    }
    return copy3
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

export function getRequestUser() {
  return request({
    url: '/login/getRequestUser',
    method: 'post'
  })
}

export function getUserDept() {
  return request({
    url: '/login/getUserNameAndId',
    method: 'post'
  })
}

export function isJson(data) {
  try {
    JSON.parse(data)
  } catch (e) {
    return false
  }
  return true
}

export function verify(str, reg) {
  if (str !== null) {
    if (str.indexOf(reg) + 1 > 0) {
      str = str.replace(new RegExp('(' + reg + ')', 'g'), '')
    }
  }
  return str
}

export function HashMap() {
  // 定义长度
  var length = 0
  // 创建一个对象
  var obj = {}

  /**
  * 判断Map是否为空
  */
  this.isEmpty = function() {
    return length === 0
  }

  /**
  * 判断对象中是否包含给定Key
  */
  this.containsKey = function(key) {
    return (key in obj)
  }

  /**
  * 判断对象中是否包含给定的Value
  */
  this.containsValue = function(value) {
    for (var key in obj) {
      if (obj[key] === value) {
        return true
      }
    }
    return false
  }

  /**
  *向map中添加数据
  */
  this.put = function(key, value) {
    if (!this.containsKey(key)) {
      length++
    }
    obj[key] = value
  }

  /**
  * 根据给定的Key获得Value
  */
  this.get = function(key) {
    return this.containsKey(key) ? obj[key] : null
  }

  /**
  * 根据给定的Key删除一个值
  */
  this.remove = function(key) {
    if (this.containsKey(key) && (delete obj[key])) {
      length--
    }
  }

  /**
  * 获得Map中的所有Value
  */
  this.values = function() {
    var _values = []
    for (var key in obj) {
      _values.push(obj[key])
    }
    return _values
  }

  /**
  * 获得Map中的所有Key
  */
  this.keySet = function() {
    var _keys = []
    for (var key in obj) {
      _keys.push(key)
    }
    return _keys
  }

  /**
  * 获得Map的长度
  */
  this.size = function() {
    return length
  }

  /**
  * 清空Map
  */
  this.clear = function() {
    length = 0
    obj = {}
  }
}

export function getIDCardInfo(idcard) {
  var map = new HashMap()
  var addstr = idcard.substring(6, 14)
  var applicantBirthDay = addstr.substring(0, 4) + '-' + addstr.substring(4, 6) + '-' + addstr.substring(6, addstr.length)
  map.put('birthDay', applicantBirthDay)
  var code = idcard.substring(idcard.length - 2, idcard.length - 1)
  if (parseInt(code) % 2 === 0) {
    map.put('sex', 1)// 女
  } else {
    map.put('sex', 0)// 男
  }
  return map
}

export function getMyUnreadMessages(staffId) {
  return request({
    url: '/notification/getMyUnReadMessage',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}

export function getStaffNameByAgentId(agentId) {
  return request({
    url: '/employee/getStaffNameByAgentId',
    method: 'get',
    params: {
      agentId: agentId
    }
  })
}

export function getNextOrganlist() {
  return request({
    url: '/organization/findNextOrganByNow',
    method: 'get'
  })
}

export function getAllDeptsByCurrent() {
  return request({
    url: '/employee/getAllDeptsByCurrent',
    method: 'get'
  })
}

export function generateValidateCode() {
  request.defaults.headers.common['Accept'] = 'image/webp,image/apng,image/*,*/*;q=0.8'
  return request({
    url: '/login/getValidateCode',
    method: 'post'
  })
}

export function changePassword(info) {
  return request({
    url: '/login/modifyPw',
    method: 'post',
    data: {
      angentId: info.staffId,
      oldPassword: info.oldPassword,
      password: info.newPassword,
      code: info.validateCode
    }
  })
}

/**
* 将秒数转化为 时分秒   sec --> hour:min:sec
* @param result
* @returns
*/
export function formatSeconds(result) {
  var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  return (h + ':' + m + ':' + s)
}

/**
 * 将数组中的两个元素交换位置
 * @param {*} arr
 * @param {*} index1
 * @param {*} index2
 */
export function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

// 获取一个时间的开始时间戳.
export function getStartTimestamp(timeStr, type) {
  const typeArray = ['hour', 'day', 'week', 'month', 'year']
  let startTime
  if (type && typeArray.includes(type)) {
    switch (type) {
      case 'hour':
        startTime = moment(timeStr, 'YYYY-MM-DD HH')
        break
      case 'day':
        startTime = moment(timeStr, 'YYYY-MM-DD')
        break
      case 'week':
        startTime = moment(timeStr, 'YYYY WW')
        break
      case 'month':
        startTime = moment(timeStr, 'YYYY-MM')
        break
      case 'year':
        startTime = moment(timeStr, 'YYYY')
        break
    }
  } else {
    return new Error(`type 只支持[${typeArray}]`)
  }
  return startTime.valueOf()
}

// 获取一个时间的结束时间戳.
export function getEndTimestamp(timeStr, type) {
  const typeArray = ['hour', 'day', 'week', 'month', 'year']
  let endTime
  if (type && typeArray.includes(type)) {
    switch (type) {
      case 'hour':
        endTime = moment(timeStr, 'YYYY-MM-DD HH').add(1, 'hours').subtract(1, 'ms')
        break
      case 'day':
        endTime = moment(timeStr, 'YYYY-MM-DD').add(1, 'days').subtract(1, 'ms')
        break
      case 'week':
        endTime = moment(timeStr, 'YYYY WW').add(1, 'weeks').subtract(1, 'ms')
        break
      case 'month':
        endTime = moment(timeStr, 'YYYY-MM').add(1, 'months').subtract(1, 'ms')
        break
      case 'year':
        endTime = moment(timeStr, 'YYYY').add(1, 'years').subtract(1, 'ms')
        break
    }
  } else {
    return new Error(`type 只支持[${typeArray}]`)
  }
  return endTime.valueOf()
}

export function sec_to_time(s) {
  var t
  if (s > -1) {
    var hour = Math.floor(s / 3600)
    var min = Math.floor(s / 60) % 60
    var sec = s % 60
    if (hour < 10) {
      t = '0' + hour + ':'
    } else {
      t = hour + ':'
    }

    if (min < 10) { t += '0' }
    t += min + ':'
    if (sec < 10) { t += '0' }
    t += sec.toFixed(0)
  }
  return t
}

// 上传功能 FS_SERVER_HOST=服务器地址 url=上传地址 ftomData=上传的流 date=日期 YYYY-MM-DD timeStamp=时间戳
export function uploading(FS_SERVER_HOST, url, formData, date, timeStamp, name) {
  let DLurl = []
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', url, true)
  if (formData.file) {
    xhr.send(formData.file)
  } else {
    xhr.send(formData)
  }
  xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
      if (!DLurl) {
        DLurl = []
      }
      if (formData.file) {
        DLurl.push({ 'name': formData.file.name, 'url': `${FS_SERVER_HOST}/crm/${localStorage.getItem('agentId') + '/' + date + '/' + timeStamp + '_' + formData.file.name}` })
        sessionStorage.setItem('DLurl', JSON.stringify(DLurl))
      } else {
        DLurl.push({ 'name': name, 'url': `${FS_SERVER_HOST}/crm/${localStorage.getItem('agentId') + '/' + date + '/' + timeStamp + '_' + name}` })
        sessionStorage.setItem('DLurl', JSON.stringify(DLurl))
      }
    }
  }
}
