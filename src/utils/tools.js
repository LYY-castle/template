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

// export function download(root, factory) {
//   if (typeof define === 'function' && define.amd) {
//     // AMD. Register as an anonymous module.
//     define([], factory)
//   } else if (typeof exports === 'object') {
//     // Node. Does not work with strict CommonJS, but
//     // only CommonJS-like environments that support module.exports,
//     // like Node.
//     module.exports = factory()
//   } else {
//     // Browser globals (root is window)
//     root.download = factory()
//   }
// }
// download()

export function download(data, strFileName, strMimeType) {
  var self = window, // this script is only for browsers anyway...
    defaultMime = 'application/octet-stream', // this default mime also triggers iframe downloads
    mimeType = strMimeType || defaultMime,
    payload = data,
    url = !strFileName && !strMimeType && payload,
    anchor = document.createElement('a'),
    toString = function(a) { return String(a) },
    myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
    fileName = strFileName || 'download',
    blob,
    reader
  myBlob = myBlob.call ? myBlob.bind(self) : Blob

  if (String(this) === 'true') { // reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
    payload = [payload, mimeType]
    mimeType = payload[0]
    payload = payload[1]
  }

  if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
    fileName = url.split('/').pop().split('?')[0]
    anchor.href = url // assign href prop to temp anchor
		  	if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
        		var ajax = new XMLHttpRequest()
        		ajax.open('GET', url, true)
        		ajax.responseType = 'blob'
        		ajax.onload = function(e) {
				  download(e.target.response, fileName, defaultMime)
      }
        		setTimeout(function() { ajax.send() }, 0) // allows setting custom ajax headers using the return:
			    return ajax
    } // end if valid url?
  } // end if url?

  // go ahead and download dataURLs right away
  if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
    if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
      payload = dataUrlToBlob(payload)
      mimeType = payload.type || defaultMime
    } else {
      return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
        ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
        : saver(payload) // everyone else can save dataURLs un-processed
    }
  }// end if dataURL passed?

  blob = payload instanceof myBlob
    ? payload
    : new myBlob([payload], { type: mimeType })

  function dataUrlToBlob(strUrl) {
    var parts = strUrl.split(/[:;,]/),
      type = parts[1],
      decoder = parts[2] == 'base64' ? atob : decodeURIComponent,
      binData = decoder(parts.pop()),
      mx = binData.length,
      i = 0,
      uiArr = new Uint8Array(mx)

    for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i)

    return new myBlob([uiArr], { type: type })
		 }

  function saver(url, winMode) {
    if ('download' in anchor) { // html5 A[download]
      anchor.href = url
      anchor.setAttribute('download', fileName)
      anchor.className = 'download-js-link'
      anchor.innerHTML = 'downloading...'
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      setTimeout(function() {
        anchor.click()
        document.body.removeChild(anchor)
        if (winMode === true) { setTimeout(function() { self.URL.revokeObjectURL(anchor.href) }, 250) }
      }, 66)
      return true
    }

    // handle non-a[download] safari as best we can:
    if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime)
      if (!window.open(url)) { // popup blocked, offer direct download:
        if (confirm('Displaying New Document\n\nUse Save As... to download, then click back to return to this page.')) { location.href = url }
      }
      return true
    }

    // do iframe dataURL download (old ch+FF):
    var f = document.createElement('iframe')
    document.body.appendChild(f)

    if (!winMode) { // force a mime that will download:
      url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, defaultMime)
    }
    f.src = url
    setTimeout(function() { document.body.removeChild(f) }, 333)
  }// end saver

  if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
    return navigator.msSaveBlob(blob, fileName)
  }

  if (self.URL) { // simple fast and modern way using Blob and URL:
    saver(self.URL.createObjectURL(blob), true)
  } else {
    // handle non-Blob()+non-URL browsers:
    if (typeof blob === 'string' || blob.constructor === toString) {
      try {
        return saver('data:' + mimeType + ';base64,' + self.btoa(blob))
      } catch (y) {
        return saver('data:' + mimeType + ',' + encodeURIComponent(blob))
      }
    }

    // Blob but not URL support:
    reader = new FileReader()
    reader.onload = function(e) {
      saver(this.result)
    }
    reader.readAsDataURL(blob)
  }
  return true
} /* end download() */
