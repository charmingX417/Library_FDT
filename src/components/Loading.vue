<template>
  <div class="loading-container">
    <div class="loading-animation">
      <div class="spinner"></div>
    </div>
    <p>加载中，请稍候...</p>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { gsap } from "gsap";

export default {
  name: "Loading",
  setup() {
    onMounted(() => {
      // GSAP 动画：旋转加载动画
      gsap.to(".spinner", {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "linear",
      });
    });
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #141e30, #243b55);
  color: white;
  font-size: 20px;
}

.loading-animation {
  margin-bottom: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #fff;
  border-radius: 50%;
}
</style>
