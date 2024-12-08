<template>
  <!-- 页面容器，用于展示数据备份与恢复功能 -->
  <div class="backup-restore-page">
    <h2>数据备份与恢复</h2> <!-- 页面标题 -->
    <el-divider></el-divider> <!-- 分隔线，用于分割页面内容 -->
    <backup-restore /> <!-- 引入并显示备份和恢复组件 -->
  </div>
</template>

<script>
// 导入备份和恢复组件
import BackupRestore from "@/components/BackupRestore.vue";

export default {
  name: "BackupRestorePage", // 当前页面组件的名称
  components: {
    BackupRestore, // 注册备份和恢复组件
  },
};
</script>

<style>
/* 样式部分，用于给页面容器添加样式 */
.backup-restore-page {
  padding: 20px; /* 添加内边距，使页面内容与边缘有间距 */
}
</style>
