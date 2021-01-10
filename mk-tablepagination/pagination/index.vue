<template>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-if="showPage"
      :current-page="curPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="totalRows"
      v-bind="pageAttrs"
      :layout="pageLayout">
  </el-pagination>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    showPage: {
      type: Boolean,
      default: true
    },
    curPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalRows: {
      type: Number,
      default: 0
    },
    pageAttrs: {
      type: Object,
      default () {
        return {}
      }
    },
    pageLayout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    }
  },
  methods: {
    handleSizeChange (v) { // 更改每页显示条数
      this.$emit('onPageSizeChange', v)
    },
    handleCurrentChange (v) { // 切换当前页
      this.$emit('onCurrentChange', v)
    }
  }
}
</script>

<style scoped lang="scss">
  .el-pagination {
    text-align: right;
    margin-top: 10px;
    /deep/ .el-form {
      .el-form-item {
        min-height: 32px;
        margin-bottom: 10px;
      }

      .el-form-item:nth-last-child(1) {
        margin-right: 0 !important;
      }
    }
  }
</style>