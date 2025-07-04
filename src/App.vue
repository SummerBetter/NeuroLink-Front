<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 使用路由系统，所有页面内容由各个路由组件提供
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

#app {
  height: 100vh;
}
</style> 