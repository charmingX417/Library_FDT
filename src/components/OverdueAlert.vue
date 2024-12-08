<template>
  <el-dialog
      :visible.sync="visible"
      title="超期提醒"
      width="400px"
      @close="handleClose"
  >
    <p>有图书已超期，请及时归还。</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showAlert() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style>
.dialog-footer {
  text-align: right;
}
</style>
