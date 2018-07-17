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
