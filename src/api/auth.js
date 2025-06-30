import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期
authApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  // 用户注册
  register: async (userData) => {
    const response = await authApi.post('/auth/register', userData)
    return response.data
  },

  // 用户登录
  login: async (loginData) => {
    const response = await authApi.post('/auth/login', loginData)
    return response.data
  },

  // 健康检查
  health: async () => {
    const response = await authApi.get('/auth/health')
    return response.data
  }
}

export default authApi 