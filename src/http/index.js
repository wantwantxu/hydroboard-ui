import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import Vue from 'vue'

Vue.component(Message.name, Message)

axios.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {}
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    if (config.method === 'get' && !config.paramsSerializer) {
      config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' })
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response
    return Promise.reject({
      message: error.message || '网络异常',
      response: response || null,
      status: (response && response.status) || -1
    })
  }
)

function checkStatus(response) {

  if (!response) {
    throw new Error('网络异常，未收到服务器响应')
  }

  if (response.status === 200) {
    return response
  } else {
    throw new Error(`接口请求失败：HTTP ${response.status}（${response.statusText || '未知错误'}）`)
  }
}

function checkCode(res) {
  const responseData = res.data || {}

  if (responseData.code === undefined) {

    return res
  } else if (responseData.code !== 200) {

    throw new Error(responseData.msg || `业务错误：错误码 ${responseData.code}`)
  }

  return res
}

const $ajax = {

  postJson(url, data) {
    return axios({
      method: 'post',
      url,
      data: data || {},
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  post(url, data, formData = false) {

    const requestData = formData ? data : qs.stringify(data || {})
    return axios({
      method: 'post',
      url,
      data: requestData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  post1(url, data, formData = false) {
    return axios({
      method: 'post',
      url,
      data: formData ? data : (data || {}),
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  getWfs(url, params) {
    return axios({
      method: 'get',
      url,
      params: params || {},
      headers: { 'Authorization': '' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  get(url, params) {
    return axios({
      method: 'get',
      url,
      params: params || {}
    })
      .then(checkStatus)
      .then(checkCode)
  },

  downLoad(url, params) {
    return axios({
      method: 'get',
      url,
      params: params || {},
      responseType: 'blob'
    })
      .then(checkStatus)
  },

  downLoadWord(url, params) {
    return axios({
      method: 'post',
      url,
      params: params || {},
      responseType: 'blob'
    })
      .then(checkStatus)
  },

  put(url, data) {
    return axios({
      method: 'put',
      url,
      data: data || {},
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  del(url, params = {}) {
    return axios({
      method: 'delete',
      url,
      params: Object.keys(params).length > 0 ? params : undefined,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
      .then(checkStatus)
      .then(checkCode)
  },

  delete(url, params = {}) {
    return this.del(url, params)
  },

  upload(url, data) {
    return axios({
      method: 'post',
      url,
      data: data || {},
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(checkStatus)
      .then(checkCode)
  }
}

export async function http(
  url,
  method,
  data = {},
  callback = null,
  back = null,
  error = null,
  isFormData = false
) {

  let loading = null
  try {

    const ajaxMethod = $ajax[method]
    if (!ajaxMethod) {
      throw new Error(`不支持的请求方法：${method}（请检查 method 是否为 post/get/del 等）`)
    }

    let res
    if (method === 'get' || method === 'getWfs' || method === 'downLoad') {
      res = await ajaxMethod(url, data)
    } else if (method === 'del' || method === 'delete') {
      res = await $ajax.del(url, data)
    } else {
      res = await ajaxMethod(url, data, isFormData)
    }

    if (method === 'downLoad' || method === 'downLoadWord') {

      const rHeader = res.headers['content-disposition']

      let fileName = '下载文件'
      if (rHeader) {
        const match = rHeader.match(/filename=([^;]+)/i)
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1].replace(/"/g, ''))
        }
      }

      const blob = new Blob([res.data], { type: res.data.type || 'application/octet-stream' })
      const eLink = document.createElement('a')
      eLink.href = URL.createObjectURL(blob)
      eLink.download = fileName
      document.body.appendChild(eLink)
      eLink.click()

      document.body.removeChild(eLink)
      URL.revokeObjectURL(eLink.href)

      if (callback) callback({ success: true, fileName })
    } else {

      const payload = res.data || {}
      const resultData = payload.code !== undefined ? payload : (payload.data || payload)
      if (callback) callback(resultData)
      return resultData
    }

  } catch (err) {

    const errMsg = err.message || '操作失败，请重试'

    if (!document.querySelector('.el-message--error')) {
      Message({
        message: errMsg,
        type: 'error',
        duration: 3000
      })
    }

    if (error) error(errMsg, err.response)

    throw err

  } finally {
    if (back) back()
  }
}

export { $ajax }
