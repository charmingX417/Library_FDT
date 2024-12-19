<template>
  <div class="loading-container" :class="{ 'fade-out': isFadingOut }">
    <div class="loading-icon"></div>
    <p class="loading-text">加载中...</p>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "Loading",
  setup() {
    const isFadingOut = ref(false);

    onMounted(() => {
      // 3秒后开始淡出
      setTimeout(() => {
        isFadingOut.value = true;
      }, 3000);
    });

    return { isFadingOut };
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffebf2; /* 柔和的粉色背景 */
  opacity: 1;
  transition: opacity 1.5s ease-out;
  flex-direction: column;
}

.loading-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid #ff80ab; /* 活力的粉色 */
  border-top: 5px solid transparent;
  margin-bottom: 20px;
  animation: spin 2s linear infinite, bounce 1.5s ease-in-out infinite;
}

.loading-text {
  font-size: 2rem;
  color: #ff80ab;
  font-family: 'Comic Sans MS', sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
}

/* 旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 弹跳效果 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 淡出效果 */
.fade-out {
  opacity: 0;
  transition: opacity 1.5s ease-out;
}
</style>
