<template>
  <div class="ai-container">
    <div class="ai-header">
      <div class="ai-logo">🤖</div>
      <h1>AI 智能助手</h1>
      <p class="ai-desc">欢迎体验 NeuroLink 的 AI 功能演示页面</p>
    </div>
    <div class="ai-content">
      <el-card class="ai-card">
        <h2>AI 聊天演示</h2>
        <el-input
          v-model="userInput"
          placeholder="请输入你的问题..."
          @keyup.enter="sendMessage"
          class="ai-input"
          :disabled="loading"
        />
        <el-button type="primary" @click="sendMessage" class="ai-btn" :loading="loading">发送</el-button>
        <div class="ai-chat-area">
          <div v-for="(msg, idx) in chatHistory" :key="idx" :class="['ai-msg', msg.role]">
            <span class="ai-role">{{ msg.role === 'user' ? '你' : 'AI' }}：</span>{{ msg.content }}
          </div>
          <div v-if="loading" class="ai-msg ai"><span class="ai-role">AI：</span>{{ streamingContent }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const userInput = ref('')
const loading = ref(false)
const streamingContent = ref('')
const chatHistory = ref([
  { role: 'ai', content: '你好，我是 NeuroLink AI，有什么可以帮您？' }
])

async function sendMessage() {
  if (!userInput.value.trim() || loading.value) return
  const message = userInput.value
  chatHistory.value.push({ role: 'user', content: message })
  userInput.value = ''
  loading.value = true
  streamingContent.value = ''
  try {
    // 使用Fetch流式读取
    const params = new URLSearchParams({ prompt: message })
    const response = await fetch(`/ai/chatStream?${params.toString()}`)
    if (!response.body) throw new Error('无流式响应')
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      if (value) {
        const chunk = decoder.decode(value, { stream: true })
        streamingContent.value += chunk
      }
    }
    chatHistory.value.push({ role: 'ai', content: streamingContent.value })
  } catch (e) {
    chatHistory.value.push({ role: 'ai', content: 'AI服务异常，请稍后再试。' })
  } finally {
    loading.value = false
    streamingContent.value = ''
  }
}
</script>

<style scoped>
.ai-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f0f8ff 0%, #e8f4f8 100%);
  padding: 40px 0;
}
.ai-header {
  text-align: center;
  margin-bottom: 30px;
}
.ai-logo {
  font-size: 3rem;
  margin-bottom: 10px;
}
.ai-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ai-desc {
  color: #666;
  font-size: 1.1rem;
}
.ai-content {
  width: 100%;
  max-width: 500px;
}
.ai-card {
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.08);
  background: #fff;
}
.ai-input {
  width: 100%;
  margin-bottom: 10px;
}
.ai-btn {
  width: 100%;
  margin-bottom: 20px;
}
.ai-chat-area {
  min-height: 120px;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  color: #333;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
}
.ai-msg {
  margin-bottom: 8px;
}
.ai-msg.user {
  text-align: right;
  color: #667eea;
}
.ai-msg.ai {
  text-align: left;
  color: #333;
}
.ai-role {
  font-weight: bold;
}
</style> 