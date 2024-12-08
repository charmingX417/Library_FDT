<template>
  <!-- 首页容器 -->
  <div class="home">
    <h2>欢迎使用图书管理系统</h2> <!-- 页面标题 -->
    <!-- 第一行的布局，设置列间距为 20px -->
    <el-row :gutter="20">
      <!-- 第一个列，宽度为 8/24 -->
      <el-col :span="8">
        <el-card>
          <h3>图书管理</h3> <!-- 卡片标题 -->
          <!-- 按钮，点击时跳转到图书管理页面 -->
          <el-button type="primary" @click="$router.push('/book-management')">管理图书</el-button>
        </el-card>
      </el-col>
      <!-- 第二个列，宽度为 8/24 -->
      <el-col :span="8">
        <el-card>
          <h3>借书管理</h3> <!-- 卡片标题 -->
          <!-- 按钮，点击时跳转到借书管理页面 -->
          <el-button type="primary" @click="$router.push('/borrow-management')">借书</el-button>
        </el-card>
      </el-col>
      <!-- 第三个列，宽度为 8/24 -->
      <el-col :span="8">
        <el-card>
          <h3>还书管理</h3> <!-- 卡片标题 -->
          <!-- 按钮，点击时跳转到还书管理页面 -->
          <el-button type="primary" @click="$router.push('/return-management')">还书</el-button>
        </el-card>
      </el-col>
    </el-row>
    <!-- 第二行的布局，设置列间距为 20px -->
    <el-row :gutter="20" class="second-row">
      <!-- 第一个列，宽度为 8/24 -->
      <el-col :span="8">
        <el-card>
          <h3>图书查询</h3> <!-- 卡片标题 -->
          <!-- 按钮，点击时跳转到查询页面 -->
          <el-button type="primary" @click="$router.push('/search')">查询图书</el-button>
        </el-card>
      </el-col>
      <!-- 第二个列，宽度为 8/24 -->
      <el-col :span="8">
        <el-card>
          <h3>数据备份与恢复</h3> <!-- 卡片标题 -->
          <!-- 按钮，点击时跳转到数据备份与恢复页面 -->
          <el-button type="primary" @click="$router.push('/backup-restore')">备份与恢复</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home", // 当前组件的名称
};
</script>

<style>
/* 样式部分，为首页容器添加样式 */
.home {
  padding: 20px; /* 添加内边距，确保页面内容与边缘有适当的间距 */
}
/* 为第二行设置顶部外边距 */
.second-row {
  margin-top: 20px;
}
</style>
