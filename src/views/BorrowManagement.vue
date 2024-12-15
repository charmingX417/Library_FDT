<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar-container">
      <Sidebar />
    </el-aside>

    <!-- 主内容区域 -->
    <el-main>
      <div class="borrow-management">
        <h2>借书管理</h2> <!-- 页面标题 -->
        <el-divider></el-divider> <!-- 分隔线 -->
        <borrow-form /> <!-- 引入并显示借书表单组件 -->
      </div>
    </el-main>
  </el-container>
</template>

<script>
// 导入借书表单组件和 Sidebar 组件
import Sidebar from "@/components/Sidebar.vue";
import BorrowForm from "@/components/BorrowForm.vue";

export default {
  name: "BorrowManagement",
  components: {
    Sidebar, // 引入 Sidebar
    BorrowForm, // 引入借书表单组件
  },
};
</script>

<style scoped>
/* 借书管理页面容器的样式 */
.borrow-management {
  padding: 20px; /* 内边距，确保内容与边缘有适当的间距 */
}

/* 容器布局样式 */
.el-container {
  display: flex;
  height: 100vh; /* 高度设置为视口高度，确保侧边栏和内容区域充满页面 */
}

/* 侧边栏样式 */
.sidebar-container {
  height: 100%; /* 确保侧边栏高度填满容器 */
  background-color: #304156; /* 侧边栏背景颜色（可根据主题需求调整） */
}

/* 主内容区域样式 */
.el-main {
  flex: 1; /* 主内容区域占据剩余空间 */
  padding: 20px; /* 添加内容内边距 */
  background-color: #f5f5f5; /* 主内容区域背景颜色（可根据主题调整） */
}
</style>
