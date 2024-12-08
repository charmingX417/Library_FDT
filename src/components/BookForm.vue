<template>
  <!-- 使用 el-form 组件创建一个表单，绑定 book 数据模型 -->
  <el-form :model="book" ref="bookForm" label-width="80px">
    <!-- 表单项：书名 -->
    <el-form-item label="书名" prop="title">
      <!-- 输入框，双向绑定 book.title -->
      <el-input v-model="book.title"></el-input>
    </el-form-item>
    <!-- 表单项：作者 -->
    <el-form-item label="作者" prop="author">
      <!-- 输入框，双向绑定 book.author -->
      <el-input v-model="book.author"></el-input>
    </el-form-item>
    <!-- 表单项：ISBN -->
    <el-form-item label="ISBN" prop="isbn">
      <!-- 输入框，双向绑定 book.isbn -->
      <el-input v-model="book.isbn"></el-input>
    </el-form-item>
    <!-- 表单项：分类 -->
    <el-form-item label="分类" prop="category">
      <!-- 输入框，双向绑定 book.category -->
      <el-input v-model="book.category"></el-input>
    </el-form-item>
    <!-- 表单项：提交和重置按钮 -->
    <el-form-item>
      <!-- 提交按钮，点击时调用 submitForm 方法 -->
      <el-button type="primary" @click="submitForm">提交</el-button>
      <!-- 重置按钮，点击时调用 resetForm 方法 -->
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  // 组件的数据部分
  data() {
    return {
      // 定义一个 book 对象，用于存储书籍的相关信息
      book: {
        title: '',
        author: '',
        isbn: '',
        category: '' // 添加分类字段
      }
    };
  },
  // 组件的方法部分
  methods: {
    // 提交表单方法
    submitForm() {
      // 在控制台输出提交的书籍信息
      console.log('提交的图书信息:', this.book);
      // 可以在此调用 Vuex 动作或 API 进行数据提交
    },
    // 重置表单方法
    resetForm() {
      // 重置表单中的所有字段
      this.$refs.bookForm.resetFields();
    }
  }
};
</script>
