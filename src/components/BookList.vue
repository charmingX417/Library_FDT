<template>
  <!-- 表格显示部分 -->
  <el-table :data="paginatedBooks" border style="width: 100%" max-height="600px">
    <!-- 表格列：编号 -->
    <el-table-column prop="id" label="编号" min-width="80"></el-table-column>

    <!-- 表格列：书名 -->
    <el-table-column label="书名" min-width="180">
      <template v-slot="scope">
        <template v-if="scope.row.editing">
          <el-input
              v-model="scope.row.title"
              placeholder="请输入书名"
              size="small"
          />
        </template>
        <template v-else>
          {{ scope.row.title }}
        </template>
      </template>
    </el-table-column>

    <!-- 表格列：作者 -->
    <el-table-column label="作者" min-width="150">
      <template v-slot="scope">
        <template v-if="scope.row.editing">
          <el-input
              v-model="scope.row.author"
              placeholder="请输入作者"
              size="small"
          />
        </template>
        <template v-else>
          {{ scope.row.author }}
        </template>
      </template>
    </el-table-column>

    <!-- 表格列：ISBN -->
    <el-table-column label="ISBN" min-width="150">
      <template v-slot="scope">
        <template v-if="scope.row.editing">
          <el-input
              v-model="scope.row.isbn"
              placeholder="请输入 ISBN"
              size="small"
          />
        </template>
        <template v-else>
          {{ scope.row.isbn }}
        </template>
      </template>
    </el-table-column>

    <!-- 表格列：分类 -->
    <el-table-column label="分类" min-width="150">
      <template v-slot="scope">
        <template v-if="scope.row.editing">
          <el-select
              v-model="scope.row.category"
              placeholder="请选择分类"
              size="small"
          >
            <el-option
                v-for="option in categoryOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            ></el-option>
          </el-select>
        </template>
        <template v-else>
          {{ scope.row.category }}
        </template>
      </template>
    </el-table-column>

    <!-- 表格列：操作 -->
    <el-table-column label="操作" min-width="200">
      <template v-slot="scope">
        <template v-if="scope.row.editing">
          <el-button
              @click="saveBook(scope.row)"
              type="primary"
              size="small"
          >
            保存
          </el-button>
          <el-button
              @click="cancelEdit(scope.row)"
              size="small"
          >
            取消
          </el-button>
        </template>
        <template v-else>
          <el-button
              @click="editBook(scope.row)"
              type="warning"
              size="small"
          >
            编辑
          </el-button>
          <el-button
              @click="confirmDelete(scope.row)"
              type="danger"
              size="small"
          >
            删除
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页组件 -->
  <el-pagination
      style="margin-top: 20px;"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="books.length"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, jumper"
  ></el-pagination>

  <!-- 添加书籍表单 -->
  <div style="margin-top: 20px;">
    <button @click="showAddBookDialog" class="el-button el-button--primary">添加书籍</button>

    <!-- 自定义添加书籍对话框 -->
    <div v-if="addDialogVisible" class="custom-dialog">
      <h3>添加书籍</h3>
      <form @submit.prevent="addBook">
        <div>
          <label for="title">书名</label>
          <input type="text" id="title" v-model="newBook.title" required />
        </div>
        <div>
          <label for="author">作者</label>
          <input type="text" id="author" v-model="newBook.author" />
        </div>
        <div>
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="newBook.isbn" />
        </div>
        <div>
          <label for="category">分类</label>
          <select id="category" v-model="newBook.category">
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <button type="submit">添加</button>
          <button type="button" @click="addDialogVisible = false">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import '../assets/styles/add_Book_Dialog.css';  // 相对路径

export default {
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 10,
      addDialogVisible: false,
      newBook: {
        title: "",
        author: "",
        isbn: "",
        category: "文学",
      },
      categoryOptions: [
        { label: "文学", value: "文学" },
        { label: "科学", value: "科学" },
        { label: "历史", value: "历史" },
        { label: "技术", value: "技术" },
      ],
      nextBookId: 1, // 初始编号为1，后续会根据实际数据更新
    };
  },
  computed: {
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.books.slice(startIndex, startIndex + this.pageSize);
    },
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:3000/api/books");
        this.books = response.data.map((book) => ({
          ...book,
          editing: false,
        }));
        if (this.books.length > 0) {
          this.nextBookId = Math.max(...this.books.map(b => b.id)) + 1; // 更新下一个编号为当前最大编号 + 1
        }
      } catch (error) {
        console.error("获取书籍失败:", error);
      }
    },
    showAddBookDialog() {
      this.addDialogVisible = true;
    },
    async addBook() {
      if (!this.newBook.title) {
        ElMessage.warning("书名不能为空！");
        return;
      }

      // 使用 nextBookId 生成新的书籍编号
      const bookToAdd = {
        id: this.nextBookId, // 新书籍的编号
        ...this.newBook,
        author: this.newBook.author || null,
        isbn: this.newBook.isbn || null,
      };

      try {
        // 向后端发送请求以添加书籍
        // 添加书籍时，使用编号作为路径的一部分
        const response = await axios.post(`http://localhost:3000/api/books/${this.nextBookId}`, bookToAdd);


        // 如果添加成功，将新书籍推入书籍列表并更新编号
        if (response.data) {
          this.books.push({ ...response.data, editing: false });
          this.addDialogVisible = false;
          this.resetNewBook();
          this.nextBookId++; // 增加下一个书籍编号
          ElMessage.success("书籍添加成功！");
        } else {
          ElMessage.error("书籍添加失败，请重试！");
        }
      } catch (error) {
        ElMessage.error("书籍添加失败，请重试！");
      }
    },
    resetNewBook() {
      this.newBook = { title: "", author: "", isbn: "", category: "文学" };
    },
    editBook(book) {
      book.editing = true;
    },
    async saveBook(book) {
      try {
        await axios.put(`http://localhost:3000/api/books/${book.id}`, book);
        book.editing = false;
        ElMessage.success("书籍修改成功！");
      } catch (error) {
        ElMessage.error("书籍修改失败，请重试！");
      }
    },
    cancelEdit(book) {
      book.editing = false;
      this.fetchBooks(); // 取消编辑后刷新数据以恢复原始值
    },
    async deleteBook(book) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${book.id}`);
        this.books = this.books.filter((item) => item.id !== book.id);
        ElMessage.success("书籍删除成功！");
      } catch (error) {
        ElMessage.error("删除书籍失败，请重试！");
      }
    },
    confirmDelete(book) {
      ElMessageBox.confirm(`确定删除书籍 "${book.title}" 吗？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.deleteBook(book);
          })
          .catch(() => {
            ElMessage.info("已取消删除");
          });
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>

<style scoped>
.custom-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
