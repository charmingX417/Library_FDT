<template>
  <!-- 借书管理页面的容器 -->
  <div class="borrow-management">
    <h2>借书管理</h2> <!-- 页面标题 -->
    <el-divider></el-divider> <!-- 分隔线，用于分隔不同部分 -->
    <borrow-form /> <!-- 引入并显示借书表单组件 -->
  </div>
</template>

<script>
// 导入用于借书管理的表单组件
import BorrowForm from "@/components/BorrowForm.vue";

export default {
  name: "BorrowManagement", // 当前组件的名称
  components: {
    BorrowForm, // 注册借书表单组件
  },
};
</script>

<style>
/* 样式部分，为借书管理页面容器添加样式 */
.borrow-management {
  padding: 20px; /* 添加内边距，确保页面内容与边缘有适当的间距 */
}
</style>
