<template>
  <!-- 页面标题，使用 h1 标签显示图书管理系统 -->
  <h1 class="header-title">图书管理系统</h1>
</template>

<script>
export default {
  // 组件的名称
  name: 'Header',
};
</script>

<style scoped>
/* 样式作用域限定在当前组件内 */
.header-title {
  background-color: #007bff; /* 设置背景颜色为蓝色 */
  color: #fff; /* 设置文字颜色为白色 */
  padding: 10px 20px; /* 设置内边距，顶部和底部 10px，左右 20px */
  border-radius: 5px; /* 设置圆角边框，半径为 5px */
  text-align: center; /* 设置文字居中对齐 */
}
</style>
