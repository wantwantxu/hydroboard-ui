export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + str).substr(('' + str).length)))
    }
  }
  return fmt
}

export function numString(v = 0) {
  v = v.toString()
  return v.replace(/\B(?=(?:\d{3})+$)/g, ',')
}


export function rainType(rv, isCareful = false) {
  if (rv === 0) {
    return {
      name: '无雨',
      value: 0
    }
  } else if (rv <= 9.9) {
    return {
      name: '小雨',
      value: 1
    }
  } else if (rv <= 24.9) {
    return {
      name: '中雨',
      value: 2
    }
  } else {
    if (isCareful) {
      if (rv <= 49.9) {
        return {
          name: '大雨',
          value: 3
        }
      } else if (rv <= 99.9) {
        return {
          name: '暴雨',
          value: 4
        }
      } else if (rv <= 249.9) {
        return {
          name: '大暴雨',
          value: 5
        }
      } else {
        return {
          name: '特大暴雨',
          value: 6
        }
      }
    } else {
      return {
        name: '大雨',
        value: 3
      }
    }
  }
}
