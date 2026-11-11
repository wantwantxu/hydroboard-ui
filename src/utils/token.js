import Cookies from 'js-cookie'

const TokenKey = '_dy_hydrology_access'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7, path: '/' })
}

export function removeToken() {

  return Cookies.remove(TokenKey, { path: '/' })
}

export function removeAllCookies() {
  try {

    const cookieStr = document.cookie || ''
    const cookieKeys = cookieStr
      .split('; ')
      .filter(item => item)
      .map(item => item.split('=')[0])

    cookieKeys.forEach(key => {

      Cookies.remove(key, { path: '/' })

    })

    console.log('所有 Cookie 已成功删除，删除的键列表：', cookieKeys)
    return true
  } catch (error) {
    console.error('删除所有 Cookie 失败：', error)
    return false
  }
}
