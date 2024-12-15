<template>
  <el-container style="height: 100vh;">
    <!-- 左侧侧边栏 -->
    <el-aside class="sidebar-container">
      <Sidebar />
    </el-aside>

    <!-- 主内容区域 -->
    <el-main>
      <div class="return-management">
        <h2>还书管理</h2> <!-- 页面标题 -->
        <el-divider></el-divider> <!-- 分割线 -->
        <!-- 显示还书表单组件 -->
        <return-form />
      </div>
    </el-main>
  </el-container>
</template>

<script>
// 导入 Sidebar 和 ReturnForm 组件
import Sidebar from "@/components/Sidebar.vue";
import ReturnForm from "@/components/ReturnForm.vue";

export default {
  name: "ReturnManagement", // 当前组件的名称
  components: {
    Sidebar, // 引入侧边栏组件
    ReturnForm, // 引入还书表单组件
  },
};
</script>

<style scoped>
/* 侧边栏容器 */
.sidebar-container {
  height: 100%; /* 高度撑满父容器 */
  background-color: #304156; /* 侧边栏背景颜色 */
}

/* 主容器，确保高度充满视口 */
.el-container {
  height: 100vh; /* 设置高度为视口高度 */
}

/* el-aside 样式，确保侧边栏高度充满父容器 */
.el-aside {
  flex: 0 0 200px; /* 固定宽度 */
  height: 100%; /* 高度充满父容器 */
}

/* el-main 样式，主内容区域 */
.el-main {
  padding: 20px; /* 内容内边距 */
  background-color: #f5f5f5; /* 主内容背景颜色 */
}
</style>
