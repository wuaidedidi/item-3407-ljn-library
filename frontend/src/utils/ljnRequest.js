import axios from 'axios'
import toast from 'react-hot-toast'

const ljnRecentMessages = new Set()

const ljnShowError = (message) => {
  if (!message || ljnRecentMessages.has(message)) return
  ljnRecentMessages.add(message)
  setTimeout(() => ljnRecentMessages.delete(message), 2000)
  toast.error(message)
}

const ljnRequest = axios.create({
  baseURL: '/api/ljn',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

ljnRequest.interceptors.request.use(
  (config) => {
    const ljnToken = localStorage.getItem('ljnToken')
    if (ljnToken) {
      config.headers.Authorization = `Bearer ${ljnToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

ljnRequest.interceptors.response.use(
  (response) => {
    const ljnRes = response.data
    if (ljnRes.code !== 200) {
      ljnShowError(ljnRes.message || '操作失败')
      const ljnError = new Error(ljnRes.message)
      ljnError._isBusinessError = true
      return Promise.reject(ljnError)
    }
    return ljnRes
  },
  (error) => {
    if (error._isBusinessError) {
      return Promise.reject(error)
    }

    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        ljnShowError('登录已过期，请重新登录')
        localStorage.removeItem('ljnToken')
        localStorage.removeItem('ljnUser')
        setTimeout(() => { window.location.href = '/login' }, 1500)
      } else if (status === 403) {
        ljnShowError('权限不足，无法执行此操作')
      } else if (data && data.message) {
        ljnShowError(data.message)
      } else {
        ljnShowError('服务器错误，请稍后重试')
      }
    } else if (error.code === 'ECONNABORTED') {
      ljnShowError('请求超时，请稍后重试')
    } else {
      ljnShowError('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

export default ljnRequest
