<template>
  <div id="app">
    <!-- 动态加载动画 -->
    <loading v-if="isLoading" />

    <!-- 主内容区域 -->
    <el-container v-show="!isLoading" style="height: 100vh;">
      <!-- 引入侧边栏 -->
      <Sidebar />
      <!-- 主内容区域 -->
      <el-main class="main-content">
        <router-view /> <!-- 显示路由匹配的功能页面 -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/Loading.vue";
import { ref } from 'vue';

export default {
  name: "App",
  components: {
    Sidebar,
    Loading,
  },
  setup() {
    const isLoading = ref(true);

    // 模拟页面加载结束，延迟1秒钟后关闭加载动画
    setTimeout(() => {
      isLoading.value = false;
    }, 1000); // 根据实际情况调整延迟时间

    return {
      isLoading
    };
  }
};
</script>

<style>
.main-content {
  padding: 20px; /* 添加内容区间距 */
}
</style>
