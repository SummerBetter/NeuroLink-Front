<template>
  <div class="login-container">
    <div class="background-animation">
      <div class="particles"></div>
      <div class="particles"></div>
      <div class="particles"></div>
    </div>
    
    <div class="login-main-card">
      <!-- 左侧图片轮播区域 -->
      <div class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
            <div 
              v-for="(image, index) in images" 
              :key="index"
              class="carousel-slide"
              :style="{ backgroundImage: `url(${image.src})` }"
            >
              <div class="carousel-overlay">
                <div class="carousel-content">
                  <h2>{{ image.title }}</h2>
                  <p>{{ image.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 轮播指示器 -->
          <div class="carousel-indicators">
            <button 
              v-for="(image, index) in images" 
              :key="index"
              :class="['indicator', { active: currentImageIndex === index }]"
              @click="goToSlide(index)"
            ></button>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录区域 -->
      <div class="login-section">
        <div class="login-form-container">
          <div class="card-header">
            <div class="logo">
              <div class="logo-icon">🤖</div>
              <h1>NeuroLink</h1>
            </div>
            <p class="subtitle">一体化AI平台--NeuroLink</p>
          </div>
          
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="usernameOrEmail">
              <label class="form-label">Account</label>
              <el-input
                v-model="loginForm.usernameOrEmail"
                placeholder="AccountName or Email"
                size="large"
                prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <label class="form-label">Password</label>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="password"
                size="large"
                prefix-icon="Lock"
                show-password
                class="custom-input"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <p>还没有账户？ <router-link to="/register" class="link">立即注册</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authService } from '../api/auth'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const currentImageIndex = ref(0)
let carouselTimer = null

// 图片轮播数据
const images = [
  {
    src: '/images/login/image0.png',
    title: 'AI连接',
    description: '智能连接数字世界的桥梁'
  },
  {
    src: '/images/login/image1.png',
    title: 'AI网络',
    description: '构建未来的智能AI管理系统'
  },
  {
    src: '/images/login/image2.png',
    title: '创新科技',
    description: '引领工作智能化的技术革命'
  }
]

const loginForm = reactive({
  usernameOrEmail: '',
  password: ''
})

const loginRules = {
  usernameOrEmail: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 轮播功能
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }, 4000)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const goToSlide = (index) => {
  currentImageIndex.value = index
  stopCarousel()
  setTimeout(() => startCarousel(), 5000) // 重新开始自动轮播
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    const response = await authService.login(loginForm)
    
    if (response.success) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      ElMessage.success(response.message)
      router.push('/dashboard')
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('登录失败，请检查网络连接')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8d8f0 0%, #c8e6f5 25%, #e8f4f8 75%, #f0f8ff 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particles {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particles:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particles:nth-child(2) {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.particles:nth-child(3) {
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

.login-main-card {
  background: transparent;
  border-radius: 20px;
  width: 75vw;
  max-width: 1200px;
  min-width: 800px;
  height: calc(75vw * 9 / 16);
  max-height: calc(1200px * 9 / 16);
  min-height: calc(800px * 9 / 16);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  display: flex;
  overflow: hidden;
}

/* 左侧图片轮播区域 */
.carousel-section {
  flex: 3;
  position: relative;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  background: #fff;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  flex: 0 0 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  text-align: center;
  color: white;
  padding: 40px;
}

.carousel-content h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.carousel-content p {
  font-size: 1.4rem;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* 右侧登录区域 */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  background: #ffffff;
  border-radius: 0 20px 20px 0;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.login-form-container {
  width: 100%;
  max-width: 320px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.logo-icon {
  font-size: 2.5rem;
  margin-right: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 2px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #888;
  text-align: left;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  border: 2px solid #e4e7ed;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.login-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.form-footer {
  text-align: center;
  color: #666;
  font-size: 1rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #764ba2;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-main-card {
    width: 85vw;
    height: calc(85vw * 9 / 16);
    min-width: 600px;
    min-height: calc(600px * 9 / 16);
  }
}

@media (max-width: 768px) {
  .login-main-card {
    flex-direction: column;
    width: 95vw;
    height: auto;
    max-height: 90vh;
    min-width: 320px;
  }
  
  .carousel-section {
    flex: 1;
    min-height: 350px;
    border-radius: 20px 20px 0 0;
  }
  
  .login-section {
    flex: 1;
    padding: 30px 20px;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .carousel-content h2 {
    font-size: 2rem;
  }
  
  .carousel-content p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-main-card {
    width: 95vw;
    height: auto;
    min-width: 300px;
  }
  
  .carousel-section {
    min-height: 280px;
    border-radius: 20px 20px 0 0;
  }
  
  .login-section {
    padding: 20px 15px;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .login-form-container {
    max-width: 100%;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
  
  .logo-icon {
    font-size: 1.8rem;
  }
  
  .carousel-content h2 {
    font-size: 1.5rem;
  }
  
  .carousel-content p {
    font-size: 0.9rem;
  }
}
</style> 