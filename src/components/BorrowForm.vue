<template>
  <!-- 使用 el-form 组件创建借书表单，绑定 borrowRecord 数据模型 -->
  <el-form :model="borrowRecord" ref="borrowForm" class="borrow-form">
    <!-- 表单项：借书人 -->
    <el-form-item label="借书人" prop="borrower">
      <!-- 输入框，双向绑定 borrowRecord.borrower -->
      <el-input v-model="borrowRecord.borrower" class="input-field"></el-input>
    </el-form-item>
    <!-- 表单项：书籍ID -->
    <el-form-item label="书籍ID" prop="bookId">
      <!-- 输入框，双向绑定 borrowRecord.bookId -->
      <el-input v-model="borrowRecord.bookId" class="input-field"></el-input>
    </el-form-item>
    <!-- 表单项：借书按钮 -->
    <el-form-item>
      <!-- 借书按钮，点击时调用 submitBorrow 方法 -->
      <el-button type="primary" class="borrow-btn" @click="submitBorrow">借书</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'; // 确保你已经安装并引入 axios

export default {
  data() {
    return {
      borrowRecord: {
        borrower: '',
        bookId: ''
      },
      userExists: false, // 用来判断用户是否存在
      bookExists: false, // 用来判断书籍是否存在
      isBookDeleted: false, // 判断书籍是否已被删除
    };
  },
  methods: {
    // 查询借书人和书籍信息
    async checkBorrowInfo() {
      const { borrower, bookId } = this.borrowRecord;

      // 检查用户是否存在
      try {
        const userResponse = await axios.get('http://localhost:3000/api/users'); // 获取所有用户信息
        const userExists = userResponse.data.some(user => user.username === borrower); // 检查用户名是否存在

        if (!userExists) {
          this.$message.error('借书人不存在');
          this.userExists = false; // 设置为false
          return;
        }
        this.userExists = true; // 设置为true
      } catch (error) {
        this.$message.error('用户信息查询失败');
        console.error(error);
        return;
      }

      // 检查书籍ID是否存在及其状态
      try {
        const bookResponse = await axios.get('http://localhost:3000/api/books'); // 获取所有书籍信息
        const book = bookResponse.data.find(b => b.id === parseInt(bookId, 10)); // 查找是否存在此书籍ID

        if (!book) {
          this.$message.error('书籍不存在');
          this.bookExists = false; // 设置为false
          return;
        }

        if (book.isdelete === 1) {
          this.$message.error('该书籍已被删除');
          this.isBookDeleted = true; // 设置为true
          return;
        }

        this.bookExists = true; // 设置为true
        this.isBookDeleted = false; // 设置为false
      } catch (error) {
        this.$message.error('书籍信息查询失败');
        console.error(error);
        return;
      }
    },

    // 借书提交方法
    async submitBorrow() {
      await this.checkBorrowInfo(); // 检查借书人和书籍信息

      if (!this.userExists || !this.bookExists || this.isBookDeleted) {
        return; // 如果有验证失败，直接返回
      }

      // 直接获取输入框的用户名和书籍ID
      const { borrower, bookId } = this.borrowRecord;

      try {
        // 提交借书请求
        const borrowData = {
          username: borrower,
          bookId: bookId
        };

        console.log('借书请求数据:', borrowData);
        const response = await axios.post('http://localhost:3000/api/borrowBook', borrowData);

        console.log(response); // 打印完整的响应数据
        if (response.status === 200) {
          this.$message.success('借书成功');
          // 清空输入框内容
          this.borrowRecord = {
            borrower: '',
            bookId: ''
          };
          // 让焦点回到“借书人”的输入框
          this.$nextTick(() => {
            this.$refs.borrowerInput.focus(); // 假设你给借书人输入框设置了 ref="borrowerInput"
          });
        }

      } catch (error) {
        console.error('借书失败:', error);
        if (error.response) {
          console.error('错误响应:', error.response);
          this.$message.error(error.response.data);  // 显示后端返回的错误信息
        } else {
          this.$message.error('借书失败');
        }
      }
    }
  }
};
</script>

<style scoped>
/* 背景颜色 */
.borrow-form {
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 50px auto;
}

/* 表单项 */
.el-form-item {
  margin-bottom: 20px;
}

/* 输入框样式 */
.input-field {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
}

/* 借书按钮样式 */
.borrow-btn {
  background-color: #70b1b5;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.borrow-btn:hover {
  background-color: #5c9b9e;
}

/* 错误提示消息 */
.el-message {
  font-size: 14px;
  color: #d9534f;
}

.el-message.success {
  color: #5cb85c;
}

/* 给表单项的标签添加一些样式 */
.el-form-item label {
  color: #666;
  font-weight: bold;
  font-size: 14px;
}

/* 改善按钮和输入框之间的间距 */
.el-form-item:last-child {
  margin-bottom: 0;
}
</style>
