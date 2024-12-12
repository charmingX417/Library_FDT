<template>
  <div class="home">
    <h2>欢迎使用图书管理系统</h2>
    <!-- 将 BookChart 组件包裹在半透明的 el-card 中 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="transparent-card">
          <h3>图书分类目录统计</h3>
          <BookChart />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BookChart from "../components/BookChart.vue"; // 确保路径正确

export default {
  name: "Home",
  components: {
    BookChart,
  },
};
</script>

<style scoped>
.transparent-card {
  background-color: rgba(255, 255, 255, 0.01); /* 半透明背景 */
  border: none; /* 去掉边框 */
  box-shadow: none; /* 去掉阴影 */
  border-radius: 10px; /* 圆角 */
  padding: 20px; /* 内边距 */
  width: 600px; /* 宽度 */
  height: 400px; /* 高度 */
  margin: auto; /* 居中 */
}

/* 使用 :deep() 选择器确保覆盖 el-card 内部的默认样式 */
.transparent-card :deep(.el-card__body) {
  background-color: rgba(255, 255, 255, 0.01); /* 确保卡片内容区背景透明 */
}
</style>
