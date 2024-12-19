<template>
  <el-row type="flex" align="middle" class="search-container">
    <!-- 查询方式选择框 -->
    <el-col :span="4" class="query-type-col">
      <el-select v-model="queryType" placeholder="选择查询方式" class="query-type-select">
        <el-option label="书名" value="title"></el-option>
        <el-option label="ID" value="id"></el-option>
        <el-option label="ISBN" value="isbn"></el-option>
      </el-select>
    </el-col>

    <!-- 查询输入框 -->
    <el-col :span="16" class="input-col">
      <el-input
          v-model="query"
          :placeholder="`请输入查询${placeholder}`"
          suffix-icon="el-icon-search"
          class="cute-input"
      />
    </el-col>

    <!-- 搜索按钮 -->
    <el-col :span="4" class="button-col">
      <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSearch"
          class="search-button"
      >
        查询
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      query: '', // 查询内容
      queryType: 'title', // 默认查询类型是按书名查询
      placeholder: '书名', // 默认提示文本
    };
  },
  methods: {
    // 点击查询按钮时触发该方法
    onSearch() {
      // 触发父组件的 search 事件，将 query 和 queryType 传递给父组件
      this.$emit('search', { query: this.query, queryType: this.queryType });
    },
  },
  watch: {
    // 根据查询方式更新占位符
    queryType(newType) {
      if (newType === 'title') {
        this.placeholder = '书名';
      } else if (newType === 'id') {
        this.placeholder = 'ID';
      } else if (newType === 'isbn') {
        this.placeholder = 'ISBN';
      }
    },
  },
};
</script>

<style scoped>
/* 设计俏皮可爱的查询组件容器 */
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 选择框容器，调整宽度 */
.query-type-col {
  padding-right: 10px;
}

/* 查询方式选择框 */
.query-type-select {
  width: 100%;
  background: linear-gradient(135deg, #f7c1f5, #fce0de);
  border-radius: 25px;
  border: 1px solid #f8a0b5;
  padding: 5px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

/* 查询输入框 */
.cute-input {
  width: 100%;
  background: linear-gradient(135deg, #f7c1f5, #fce0de);
  border-radius: 25px;
  padding: 10px 20px;
  border: 1px solid #f8a0b5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #ff6bb0;
  transition: all 0.3s ease-in-out;
}

/* 输入框获得焦点时的动画效果 */
.cute-input:focus {
  box-shadow: 0 0 10px rgba(255, 107, 176, 0.7);
  border-color: #ff6bb0;
  transform: scale(1.05);
}

/* 图标样式 */
.cute-input .el-input__icon {
  color: #ff6bb0;
  font-size: 18px;
  transition: color 0.3s ease;
}

/* 输入框内容发生变化时图标变色 */
.cute-input:hover .el-input__icon {
  color: #ff4f88;
}

/* 查询按钮样式 */
.cute-button {
  width: 100%;
  background-color: #ff6bb0;
  color: white;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cute-button:hover {
  background-color: #ff4f88;
  transform: scale(1.05);
}

/* 按钮所在的列 */
.button-col {
  padding-left: 10px;
}
</style>
