<template>
  <!-- 使用 el-card 组件显示用户信息 -->
  <el-card>
    <!-- 显示用户的姓名，使用双花括号插值语法 -->
    <h3>{{ user.name }}</h3>
    <!-- 显示借书卡号，使用双花括号插值语法 -->
    <p>借书卡号: {{ user.cardNumber }}</p>
    <!-- 显示借书历史，显示已借书籍的数量 -->
    <p>借书历史: {{ user.borrowedBooks.length }} 本</p>
  </el-card>
</template>

<script>
export default {
  // 定义组件的 props 属性，接收父组件传递的 user 对象
  props: {
    user: Object // 用户对象，包含用户的姓名、借书卡号和借书历史等信息
  }
};
</script>
