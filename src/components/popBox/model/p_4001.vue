<template>
  <div class="pop-base">
    <span class="close" @click="toClose"><i class="el-icon-close"></i></span>
    <dl>
      <dt>{{options.name}}</dt>
      <dd>总人口：{{options.total}}(人)</dd>
      <dd>人口密度：{{options.density}}(人/平方公里)</dd>
      <dd>儿童人口：{{options.children}}(人)</dd>
      <dd>老年人口：{{options.elderly}}(人)</dd>
    </dl>
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
    padding: 15px;
    box-shadow: 0 0 10px 0 #00fff6;
    background: rgba(0, 16, 30, .9);
    border-radius: 8px;
    color: #fff;

    dt {
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 5px;
    }

    dd {
      line-height: 24px;
      font-size: 14px;
    }

    .close {
      position: absolute;
      right: 4px;
      top: 4px;
      color: rgba(0, 252, 255, .7);
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>
