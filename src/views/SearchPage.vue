<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" class="sidebar-container">
      <Sidebar />
    </el-aside>

    <el-main>
      <div class="search-page">
        <h2 class="page-title">图书查询</h2>
        <el-divider class="page-divider"></el-divider>

        <!-- SearchBar component to trigger search -->
        <search-bar @search="onSearch" class="cute-search-bar" />

        <el-divider class="page-divider"></el-divider>

        <div class="results-container">
          <el-table :data="searchResults" style="width: 100%" class="results-table">
            <el-table-column prop="id" label="编号" width="120">
              <template v-slot="scope">
                <span>{{ scope.row.id || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="封面" width="180">
              <template v-slot="scope">
                <img :src="scope.row.cover || defaultCover" alt="封面"
                     style="width: 100px; height: 140px; object-fit: cover;" />
                <span v-if="!scope.row.cover" class="no-cover-text">暂无记录</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="书名" width="180">
              <template v-slot="scope">
                <span>{{ scope.row.title || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="150">
              <template v-slot="scope">
                <span>{{ scope.row.author || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isbn" label="ISBN" width="120">
              <template v-slot="scope">
                <span>{{ scope.row.isbn || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="150">
              <template v-slot="scope">
                <span>{{ scope.row.category || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reading" label="阅读人数" width="130">
              <template v-slot="scope">
                <span>{{ scope.row.reading || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="借阅状态" width="150">
              <template v-slot="scope">
                <span>{{ scope.row.isborrowed || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template v-slot="scope">
                <span>{{ scope.row.created_at || '暂无记录' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updated_at" label="更新时间" width="180">
              <template v-slot="scope">
                <span>{{ scope.row.updated_at || '暂无记录' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import axios from 'axios';
import SearchBar from "@/components/SearchBar.vue";
import Sidebar from "@/components/Sidebar.vue";
import defaultCover from '@/assets/default-cover.png'; // Default cover image

export default {
  name: "SearchPage",
  components: {
    SearchBar,
    Sidebar,
  },
  data() {
    return {
      allBooks: [],  // Store all books fetched from backend
      searchResults: [], // Store filtered results to bind to the table
      queryType: 'title',  // Default query type
      query: '',  // Search query
      defaultCover, // Default cover image for missing covers
    };
  },
  methods: {
    // 获取所有图书数据
    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:3000/api/books');
        this.allBooks = response.data;
        console.log('图书获取成功');
      } catch (error) {
        console.error('获取图书信息失败', error);
        this.$message.error('获取图书信息失败');
      }
    },
    // 根据查询内容和类型过滤图书
    onSearch({ query, queryType }) {

      // 打印传递过来的查询内容和查询类型
      console.log('查询内容:', query);
      console.log('查询类型:', queryType);

      let filteredBooks = [];

      // 根据查询类型进行过滤
      if (queryType === 'title') {
        console.log('执行title查询');
        // 检查是否进入了 filter 函数
        filteredBooks = this.allBooks.filter(book => {
          const bookTitle = book.title.trim(); // 去掉前后的空格
          const searchQuery = query.trim(); // 去掉查询内容的前后空格
          return bookTitle.includes(searchQuery); // 根据原始查询内容进行匹配
        });

      } else if (queryType === 'id') {
        console.log('id');
        filteredBooks = this.allBooks.filter(book =>
            book.id.toString().includes(query) // 按原始 ID 进行匹配
        );
      } else if (queryType === 'isbn') {
        console.log('isbn');
        filteredBooks = this.allBooks.filter(book =>
            book.isbn.includes(query) // 按原始 ISBN 进行匹配
        );
      }

      // 筛选图书的结果
      this.searchResults = filteredBooks.map(book => {
        return {

          id: book.id,
          cover: book.img,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          reading: book.reading,
          isborrowed: book.isBorrowed === 1 ? '已借出' : '未借出',
          created_at: book.created_at,
          updated_at: book.updated_at,
        };
      });

      if (filteredBooks.length > 0) {
        this.$message.success('查询成功！');
      } else {
        this.$message.warning('没有找到匹配的图书。');
      }
    },
  },
  mounted() {
    /// 如果图书数据为空，加载图书数据
    if (this.allBooks.length === 0) {
      console.log('图书数据为空，准备加载图书数据...');
      this.fetchBooks();  // 假设 fetchBooks 会加载图书数据
    }
  },
};
</script>

<style scoped>
.search-page {
  padding: 20px;
  background: linear-gradient(135deg, #f7c1f5, #fce0de);
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1500px;
  margin: auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff6bb0;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.page-divider {
  border-top: 2px solid #ff6bb0;
  margin: 10px 0;
}

.cute-search-bar {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.results-container {
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.results-table {
  background-color: #f7f7f7;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.results-table .el-table__header th {
  background-color: #ffeff1;
  color: #ff6bb0;
  font-weight: bold;
  font-size: 16px;
}

.results-table tr:hover {
  background-color: #ffe6f0;
  transform: scale(1.02);
  transition: transform 0.3s ease-in-out;
}

.results-table .el-table__body td {
  font-size: 16px;
  padding: 15px 10px;
}

.no-cover-text {
  color: #999;
  font-size: 14px;
}

.sidebar-container {
  height: 100%;
  background-color: #304156;
  color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100vh;
  display: flex;
}
</style>
