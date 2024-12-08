<template>
  <!-- 使用 el-form 组件创建还书表单，绑定 returnForm 数据模型 -->
  <el-form :model="returnForm" ref="returnFormRef" class="return-form">
    <!-- 表单项：借书卡号 -->
    <el-form-item label="借书卡号" prop="cardNumber">
      <!-- 输入框，双向绑定 returnForm.cardNumber，提示用户输入借书卡号 -->
      <el-input v-model="returnForm.cardNumber" placeholder="请输入借书卡号" />
    </el-form-item>
    <!-- 表单项：图书编号 -->
    <el-form-item label="图书编号" prop="bookId">
      <!-- 输入框，双向绑定 returnForm.bookId，提示用户输入图书编号 -->
      <el-input v-model="returnForm.bookId" placeholder="请输入图书编号" />
    </el-form-item>
    <!-- 提交按钮，点击时调用 submitReturn 方法 -->
    <el-button type="primary" @click="submitReturn">还书</el-button>
  </el-form>
</template>

<script>
export default {
  // 组件的数据部分
  data() {
    return {
      // 定义还书表单数据模型
      returnForm: {
        cardNumber: '', // 借书卡号
        bookId: '', // 图书编号
      },
    };
  },
  // 组件的方法部分
  methods: {
    // 提交还书表单的方法
    submitReturn() {
      // 验证表单，如果验证通过，则输出数据并显示成功消息
      if (this.$refs.returnFormRef.validate()) {
        console.log('还书表单数据:', this.returnForm);
        // 可以在此调用 API 提交还书数据
        this.$message.success('还书成功');
      } else {
        // 如果验证不通过，显示错误消息
        this.$message.error('请填写完整信息');
      }
    },
  },
};
</script>

<style>
/* 设置还书表单的最大宽度和居中对齐 */
.return-form {
  max-width: 500px; /* 设置表单的最大宽度 */
  margin: 0 auto; /* 将表单居中 */
}
</style>
