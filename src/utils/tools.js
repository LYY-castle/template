import request from '@/utils/request'
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

export function verify(str, reg) {
  if (str !== null) {
    if (str.indexOf(reg) + 1 > 0) {
      str = str.replace(new RegExp('(' + reg + ')', 'g'), '')
    }
  }
  return str
}
