<template>
  <!-- 图书管理页面的容器 -->
  <div class="book-management">
    <h2>图书管理</h2> <!-- 页面标题 -->
    <el-divider></el-divider> <!-- 分隔线，用于分隔不同部分 -->

    <!-- 添加/修改图书的表单组件 -->
    <book-form />

    <el-divider></el-divider> <!-- 另一条分隔线 -->

    <!-- 显示图书列表的组件 -->
    <book-list />
  </div>
</template>

<script>
// 导入用于图书管理的表单和列表组件
import BookForm from "@/components/BookForm.vue";
import BookList from "@/components/BookList.vue";

export default {
  name: "BookManagement", // 当前组件的名称
  components: {
    BookForm, // 注册添加/修改图书的表单组件
    BookList, // 注册显示图书列表的组件
  },
};
</script>

<style scoped>
/* 为图书管理页面容器添加样式 */
.book-management {
  padding: 20px; /* 添加内边距，确保页面内容与边缘有适当的间距 */
  background-color: #ffffff; /* 背景颜色，适配主内容区 */
  border-radius: 8px; /* 添加圆角，让页面更美观 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
</style>
