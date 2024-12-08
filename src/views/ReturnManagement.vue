<template>
  <!-- 还书管理页面的容器 -->
  <div class="return-management">
    <h2>还书管理</h2> <!-- 页面标题 -->
    <el-divider></el-divider> <!-- 分割线，分隔页面内容 -->
    <!-- 引入并显示还书表单组件 -->
    <return-form />
  </div>
</template>

<script>
import ReturnForm from "@/components/ReturnForm.vue"; // 导入还书表单组件

export default {
  name: "ReturnManagement", // 当前组件的名称
  components: {
    ReturnForm, // 注册还书表单组件
  },
};
</script>

<style>
/* 为还书管理页面的容器设置样式 */
.return-management {
  padding: 20px; /* 页面内边距，确保内容与边缘有适当的间距 */
}
</style>
