<template>
  <!-- 图书管理页面的主容器 -->
  <el-container style="height: 100vh;">
    <!-- 侧边栏部分 -->
    <el-aside
        width="200px"
        class="sidebar-container"
    >
      <Sidebar />
    </el-aside>

    <!-- 主内容区 -->
    <el-main>
      <div class="book-management">
        <h2>图书管理</h2> <!-- 页面标题 -->
        <el-divider></el-divider> <!-- 分隔线 -->

        <!-- 图书统计和分类数目区域 -->
        <div class="stats-and-form">
          <!-- 显示图书分类数目的组件 -->
          <book-form />
          <!-- 显示图书阅读人数的图表组件 -->
          <book-reading-chart />
        </div>

        <el-divider></el-divider> <!-- 分隔线 -->
        <!-- 显示图书列表的组件 -->
        <book-list />
      </div>
    </el-main>
  </el-container>
</template>

<script>
// 导入用于图书管理的表单、列表和阅读人数图表组件
import BookForm from "@/components/BookChart.vue";
import BookList from "@/components/BookList.vue";
import BookReadingChart from "@/components/BookReadingChart.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "BookManagement", // 当前组件的名称
  components: {
    Sidebar,
    BookForm, // 注册添加/修改图书的表单组件
    BookList, // 注册显示图书列表的组件
    BookReadingChart, // 注册显示图书阅读人数图表的组件
  },
};
</script>

<style scoped>
/* 主页面容器的样式 */
.book-management {
  padding: 20px; /* 内边距，确保页面内容与边缘有适当的间距 */
  background-color: #ffffff; /* 主内容区域背景颜色 */
  border-radius: 8px; /* 圆角让页面更美观 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 统计区域与表单的容器 */
.stats-and-form {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 子元素两端对齐 */
  align-items: flex-start; /* 子元素顶部对齐 */
  gap: 20px; /* 子元素之间的间距 */
}

.stats-and-form > * {
  flex: 1; /* 子元素平分宽度 */
}

/* 侧边栏样式 */
.sidebar-container {
  height: 100%; /* 确保侧边栏高度撑满父容器 */
  background-color: #304156; /* 侧边栏背景颜色 */
  color: #ffffff; /* 侧边栏文字颜色 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* 添加阴影分隔效果 */
  display: flex;
  flex-direction: column; /* 侧边栏垂直布局 */
}

/* ElContainer 样式确保页面高度充满视口 */
.el-container {
  height: 100vh; /* 设置页面高度等于视口高度 */
  display: flex; /* 水平布局 */
}
</style>
