<template>
  <!-- 使用 el-form 组件创建借书表单，绑定 borrowRecord 数据模型 -->
  <el-form :model="borrowRecord" ref="borrowForm">
    <!-- 表单项：借书人 -->
    <el-form-item label="借书人" prop="borrower">
      <!-- 输入框，双向绑定 borrowRecord.borrower -->
      <el-input v-model="borrowRecord.borrower"></el-input>
    </el-form-item>
    <!-- 表单项：书籍ID -->
    <el-form-item label="书籍ID" prop="bookId">
      <!-- 输入框，双向绑定 borrowRecord.bookId -->
      <el-input v-model="borrowRecord.bookId"></el-input>
    </el-form-item>
    <!-- 表单项：借书按钮 -->
    <el-form-item>
      <!-- 借书按钮，点击时调用 submitBorrow 方法 -->
      <el-button type="primary" @click="submitBorrow">借书</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  // 组件的数据部分
  data() {
    return {
      // 定义借书记录对象，包含借书人和书籍ID
      borrowRecord: {
        borrower: '',
        bookId: ''
      }
    };
  },
  // 组件的方法部分
  methods: {
    // 借书提交方法
    submitBorrow() {
      // 在控制台输出借书信息
      console.log('借书信息:', this.borrowRecord);
      // 可以在此调用 Vuex 动作或 API 提交数据进行借书处理
    }
  }
};
</script>
