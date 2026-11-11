<template>
  <div class="pop-base">
    {{options.name}}
    <span class="close" @click="toClose">
        <i class="el-icon-close"></i>
      </span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      options: {
        type: Object,
        default() {
          return null
        }
      }
    },
    methods: {
      toClose() {
        this.$emit('close')
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-base {
    padding: 15px 20px 15px 15px;
    box-shadow: 0 0 10px 0 #00fff6;
    background: rgba(0, 16, 30, .9);
    border-radius: 8px;
    color: #fff;
    position: relative;

    .close{
      position: absolute;
      right: 4px;
      top: 4px;
      color: rgba(0, 252, 255, .7);
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>
