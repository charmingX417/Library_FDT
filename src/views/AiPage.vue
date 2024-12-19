<template>
  <div class="ai-page">
    <h1>高性能笨蛋ATRI</h1>
    <AiBot />
  </div>
</template>

<script setup>
import AiBot from '@/components/AiBot.vue';
</script>

<style scoped>
.ai-page {
  height: 80vh; /* 设置页面高度为视口高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  overflow: hidden; /* 防止出现滚动条 */
}

h1 {
  font-size: 2rem;
  color: #1fe6d0;
  margin-bottom: 20px;
  text-align: center;
  flex-shrink: 0; /* 避免标题压缩 */
}
</style>
