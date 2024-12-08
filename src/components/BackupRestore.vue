<template>
  <!-- 使用 el-card 组件来创建一个卡片容器 -->
  <el-card>
    <!-- 数据备份按钮，点击时调用 backupData 方法 -->
    <el-button @click="backupData" type="success">数据备份</el-button>
    <!-- 数据恢复按钮，点击时调用 restoreData 方法 -->
    <el-button @click="restoreData" type="danger">数据恢复</el-button>
  </el-card>
</template>

<script>
export default {
  // 组件方法定义
  methods: {
    // 数据备份方法
    backupData() {
      console.log('执行数据备份');
      // 调用 API 执行数据备份操作
    },
    // 数据恢复方法
    restoreData() {
      console.log('执行数据恢复');
      // 调用 API 执行数据恢复操作
    }
  }
};
</script>
