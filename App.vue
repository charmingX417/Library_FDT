<template>
  <el-container style="height: 100vh;">
    <!-- 引入侧边栏 -->
    <Sidebar />
    <!-- 主内容区域 -->
    <el-main class="main-content">
      <router-view /> <!-- 显示路由匹配的功能页面 -->
    </el-main>
  </el-container>
</template>

<script>
 // 引入侧边栏组件
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar, // 注册侧边栏组件
  },
};
</script>

<style>
.main-content {
  padding: 20px; /* 添加内容区间距 */
}
</style>
