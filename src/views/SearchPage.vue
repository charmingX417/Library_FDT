<template>
  <!-- 图书查询页面的主容器 -->
  <el-container style="height: 100vh;">
    <!-- 侧边栏部分 -->
    <el-aside width="200px" class="sidebar-container">
      <Sidebar />
    </el-aside>

    <!-- 主内容区 -->
    <el-main>
      <div class="search-page">
        <h2>图书查询</h2> <!-- 页面标题 -->
        <el-divider></el-divider> <!-- 分割线，分隔页面内容 -->

        <!-- 搜索栏组件，触发搜索时调用 onSearch 方法 -->
        <search-bar @search="onSearch" />

        <el-divider></el-divider> <!-- 再次分割页面内容 -->

        <!-- 显示搜索结果的表格 -->
        <el-table :data="searchResults" style="width: 100%">
          <el-table-column prop="title" label="书名" width="180"></el-table-column>
          <el-table-column prop="author" label="作者" width="150"></el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="120"></el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue"; // 导入搜索栏组件
import Sidebar from "@/components/Sidebar.vue"; // 导入侧边栏组件

export default {
  name: "SearchPage", // 当前组件的名称
  components: {
    SearchBar, // 注册搜索栏组件
    Sidebar,   // 注册侧边栏组件
  },
  data() {
    return {
      searchResults: [], // 用于存储搜索结果的数据
    };
  },
  methods: {
    // 搜索方法，接收来自搜索栏的关键词
    onSearch(query) {
      console.log("搜索关键词:", query); // 在控制台输出搜索关键词
      // 在这里模拟 API 请求并更新搜索结果
      this.searchResults = [
        {title: "Vue.js Basics", author: "Evan You", isbn: "1234567890"},
      ];
    },
  },
};
</script>

<style scoped>
/* 主页面容器的样式 */
.search-page {
  padding: 20px; /* 页面内边距，确保内容与边缘有适当的间距 */
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
