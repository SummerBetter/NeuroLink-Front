<template>
  <el-container class="dashboard-layout">
    <!-- 顶部导航栏，横向铺满 -->
    <el-header class="top-header">
      <div class="logo">
        <span class="logo-icon">🤖</span>
        <span class="logo-text">NeuroLink</span>
      </div>
      <el-input class="search-bar" placeholder="搜索平台内容..." clearable />
      <div class="user-info">
        欢迎，{{ userInfo?.username }}
        <el-button type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="90px" class="side-nav">
        <div class="nav-list">
          <div
            v-for="item in modules"
            :key="item.key"
            :class="['nav-item', {active: currentModule === item.key}]"
            @click="selectModule(item.key)"
          >
            <div class="nav-icon">{{ item.icon }}</div>
            <div class="nav-label">{{ item.label }}</div>
          </div>
        </div>
        <div class="nav-home"
          :class="['nav-item', {active: currentModule === ''}]"
          @click="selectModule('')"
        >
          <div class="nav-icon">🏠</div>
          <div class="nav-label">主页</div>
        </div>
      </el-aside>
      <el-main class="main-content">
        <div v-if="!currentModule" class="system-intro">
          <div class="intro-bg-glow"></div>
          <h1>欢迎来到 <span class="intro-gradient">NeuroLink 一体化AI平台</span></h1>
          <p class="intro-lead">让智能触手可及，赋能每一位用户</p>
          <ul class="intro-list">
            <li>🚀 融合多种AI能力，助力高效办公与创新</li>
            <li>🔒 数据安全与隐私保护，值得信赖</li>
            <li>💬 智能对话、知识管理、AI工具一站式体验</li>
            <li>🛒 丰富AI资源与应用，持续扩展生态</li>
          </ul>
          <div class="intro-footer">开启智能新时代，尽在 NeuroLink！</div>
        </div>
        <div v-else class="module-content">
          <h2>{{ getModuleLabel(currentModule) }}</h2>
          <p>模块内容敬请期待...</p>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userInfo = ref(null)
const currentModule = ref('')

const modules = [
  { key: 'info', icon: '📁', label: '信息管理' },
  { key: 'ai', icon: '🤖', label: 'AI赋能' },
  { key: 'chat', icon: '💬', label: 'NeuroChat' },
  { key: 'store', icon: '🛒', label: 'NeuroStore' },
]

onMounted(() => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})

const selectModule = (key) => {
  currentModule.value = key
}

const getModuleLabel = (key) => {
  const found = modules.find(m => m.key === key)
  return found ? found.label : ''
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
* {
  box-sizing: border-box !important;
}
.dashboard-layout,
.el-container,
.el-header,
.el-aside,
.el-main {
  height: 100%;
  min-height: 0;
}
.dashboard-layout {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.top-header {
  display: flex;
  align-items: center;
  height: 64px;
  background: rgba(255,255,255,0.95);
  border-bottom: 1.5px solid #e0e6ed;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  padding: 0 32px;
  z-index: 10;
  width: 100%;
  position: relative;
  left: 0;
  top: 0;
  flex-shrink: 0;
}
.side-nav {
  background: #f7f9fb;
  border-right: 1.5px solid #e0e6ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  height: 100%;
  min-height: 0;
  justify-content: space-between;
}
.nav-list {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-item {
  width: 70px;
  height: 90px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  font-weight: 500;
  color: #555;
}
.nav-item.active, .nav-item:hover {
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  box-shadow: 0 2px 12px 0 #a084ee22;
  color: #764ba2;
}
.nav-icon {
  font-size: 2.2rem;
  margin-bottom: 6px;
}
.nav-label {
  font-size: 0.98rem;
  text-align: center;
  word-break: keep-all;
}
.nav-home {
  margin-top: auto;
  margin-bottom: 32px;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 32px;
}
.logo-icon {
  font-size: 2.1rem;
  margin-right: 8px;
  animation: pulse 2s infinite;
}
.logo-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.search-bar {
  flex: 1;
  margin: 0 32px 0 0;
  max-width: 420px;
}
.user-info {
  color: #666;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}
.el-main.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  min-height: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  overflow: auto;
}
.system-intro {
  position: relative;
  background: rgba(255,255,255,0.92);
  border-radius: 24px;
  box-shadow: 0 8px 40px 0 #a084ee22;
  padding: 32px 18px 28px 18px;
  max-width: 900px;
  width: 100%;
  margin: 40px 0 40px 0;
  text-align: center;
  z-index: 1;
  overflow: hidden;
  flex-shrink: 0;
}
.intro-bg-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 340px;
  height: 180px;
  background: radial-gradient(ellipse at center, #a084ee33 0%, #fff0 80%);
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
}
.system-intro h1 {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: 1.5px;
}
.intro-gradient {
  background: linear-gradient(90deg, #667eea, #a084ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.intro-lead {
  font-size: 1.2rem;
  color: #764ba2;
  margin-bottom: 32px;
  font-weight: 600;
}
.intro-list {
  text-align: left;
  margin: 0 auto 32px auto;
  padding: 0 0 0 0.5em;
  max-width: 600px;
  color: #555;
  font-size: 1.08rem;
  line-height: 2.1;
}
.intro-footer {
  font-size: 1.12rem;
  color: #667eea;
  font-weight: 700;
  margin-top: 18px;
  letter-spacing: 1.2px;
}
.module-content {
  width: 100%;
  text-align: center;
  margin-top: 80px;
}
@media (max-width: 900px) {
  .system-intro {
    max-width: 98vw;
    padding: 24px 4px 18px 4px;
    margin: 20px 0 20px 0;
  }
  .system-intro h1 {
    font-size: 1.3rem;
  }
  .intro-lead {
    font-size: 1.05rem;
  }
  .intro-list {
    font-size: 1rem;
  }
}
</style> 