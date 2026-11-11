<template>
  <div>
    <div class="tab-con">
        <el-form ref="form" label-width="120px">
          <el-form-item label="预警类型：">
            {{options.wrType}}
          </el-form-item>
          <el-form-item label="预警等级：">
            {{options.wrLevel}}
          </el-form-item>
          <el-form-item label="预警内容：">
            {{options.wrDetail}}
          </el-form-item>
          <el-form-item label="预警影像范围：">
            {{options.influadName}}
          </el-form-item>
          <el-form-item label="预警终止时间：">
            {{options.eymdh}}
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {},
    props: {
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      init(options) {
          console.log(options)
      },
      handleTabClick() {

      },
      toClose() {

      }
    },
    watch: {
      options: {
        handler(v) {
          this.$nextTick(() => {
            this.init(v)
          })
        },
        immediate: true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-form-item{
    margin-bottom: 0px;
  }
</style>
