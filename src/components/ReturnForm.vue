<template>
  <div>
    <!-- 还书表单 -->
    <el-form :model="returnForm" ref="returnFormRef" class="return-form">
      <el-form-item label="还书人" prop="returner">
        <el-input v-model="returnForm.returner" placeholder="请输入还书人" />
      </el-form-item>

      <el-form-item label="书籍ID" prop="bookId">
        <el-input v-model="returnForm.bookId" placeholder="请输入书籍ID" />
      </el-form-item>

      <!-- 提交还书按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitReturn">还书</el-button>
      </el-form-item>
    </el-form>

    <!-- 借书记录表格 -->
    <el-table :data="paginatedRecords" style="width: 100%" v-if="borrowRecords.length > 0">
      <el-table-column label="还书人" prop="returner"></el-table-column>
      <el-table-column label="书籍ID" prop="bookId"></el-table-column>
      <el-table-column label="借书时间" prop="borrowed_at"></el-table-column>
      <el-table-column label="归还状态" prop="returnedStatus"></el-table-column>
      <!-- 删除了归还时间这一列 -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
        v-if="borrowRecords.length > pageSize"
        :page-size="pageSize"
        :total="borrowRecords.length"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper, ->, total">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'; // 引入axios用于发送请求

export default {
  data() {
    return {
      borrowRecords: [], // 存储所有借书记录
      returnForm: {       // 存储还书表单数据
        returner: '',
        bookId: ''
      },
      pageSize: 8,        // 每页显示的记录数
      currentPage: 1,     // 当前页数
    };
  },
  computed: {
    // 分页后的记录
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.borrowRecords.slice(start, end);
    }
  },
  methods: {
    // 获取所有借书记录
    async getBorrowedBookInfo() {
      try {
        const response = await axios.get('http://localhost:3000/api/borrowRecords');
        if (response.data.length === 0) {
          this.$message.error('未找到借书记录');
          return;
        }

        const records = response.data;

        // 获取借书记录的用户和书籍详细信息
        for (let record of records) {
          const userResponse = await axios.get('http://localhost:3000/api/users', {
            params: { userId: record.user_id }
          });

          const bookResponse = await axios.get('http://localhost:3000/api/books', {
            params: { bookId: record.book_id }
          });

          // 填充记录数据
          record.returner = userResponse.data[0].username;
          record.bookId = record.book_id;// 显示书籍ID
          record.borrowed_at = record.borrowed_at;
          record.returnedStatus = record.returned_at ? '已归还' : '未归还';
          record.returned_at = record.returned_at || '';
        }

        this.borrowRecords = records;
      } catch (error) {
        console.error('获取借书记录失败', error);
        this.$message.error('获取借书记录失败');
      }
    },

    // 提交还书请求
    async submitReturn() {
      const { bookId, returner } = this.returnForm;

      if (!bookId || !returner) {
        return this.$message.error('请填写还书人和书籍ID');
      }

      // 查询并验证借书记录
      const record = this.borrowRecords.find(
          (item) => item.bookId == bookId && item.returner === returner
      );

      if (!record) {
        return this.$message.error('未找到借书记录');
      }

      if (record.returnedStatus === '已归还') {
        return this.$message.error('该书籍已归还，不能重复还书');
      }

      // 获取用户ID
      try {
        const userResponse = await axios.get('http://localhost:3000/api/users'); // 获取所有用户数据
        console.log('所有用户数据:', userResponse.data); // 打印所有用户数据

        // 在所有用户中根据用户名查找对应的用户ID
        const user = userResponse.data.find(user => user.username === returner);

        if (!user) {
          return this.$message.error('未找到该用户');
        }

        const userId = user.userId;  // 修改为 user.userId 获取正确的用户ID
        console.log('找到的用户ID:', userId);  // 打印用户ID，确保数据正确

        // 提交还书请求
        const returnData = {
          userId: userId,  // 使用 userId
          bookId: bookId
        };

        // 打印请求数据
        console.log('提交的还书请求数据:', returnData);

        const response = await axios.post('http://localhost:3000/api/returnBook', returnData);

        if (response.status === 200) {
          this.$message.success('还书成功');
          this.getBorrowedBookInfo(); // 还书成功后刷新记录
        } else {
          this.$message.error('还书失败');
        }
      } catch (error) {
        console.error('还书失败', error);
        this.$message.error('还书失败');
      }
    },
    // 处理分页
    handlePageChange(page) {
      this.currentPage = page;
    }
  },
  mounted() {
    // 页面加载时自动获取所有借书记录
    this.getBorrowedBookInfo();
  }
};
</script>

<style scoped>
/* 设置表单样式 */
.return-form {
  max-width: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px; /* 增加表单与下面列表的间隔 */
}

/* 表单项 */
.el-form-item {
  margin-bottom: 20px;
}

/* 输入框样式 */
.el-input {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
}

/* 提交按钮样式 */
.el-button {
  background-color: #70b1b5;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #5c9b9e;
}

/* 分页样式 */
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
