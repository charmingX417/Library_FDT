<template>
  <!-- 双向绑定 query 数据模型 -->

  <!-- suffix-icon="el-icon-search" 输入框右侧的搜索图标 -->
  <!--@input="onInput"  当输入框内容变化时触发 onInput 方法 -->
  <el-input
      v-model="query"
      placeholder="请输入查询内容"
      suffix-icon="el-icon-search"
      @input="onInput"
  >
  </el-input>
</template>

<script>
export default {
  // 组件的数据部分
  data() {
    return {
      query: '', // 定义查询内容的数据模型
    };
  },
  // 组件的方法部分
  methods: {
    // 输入框内容变化时触发的方法
    onInput() {
      // 将查询内容通过 'search' 事件传递给父组件
      this.$emit('search', this.query);
    },
  },
};
</script>

<style>
.el-input {
  width: 100%;
}
</style>
