<template>
  <div class="right-control">

    <div class="rc-box" :class="{'hide':box2}">
      <div class="rc-title" @click="toggle('box2')">模式预报 <i class="el-icon-d-arrow-left"></i></div>
      <div class="rc-bd">
        <el-radio-group v-model="options.model" @change="modelChange">
          <el-radio :label="1" v-if="JSON.parse(dict.modelForecast[0].value).lntelligentGrid">智能网格</el-radio>
          <el-radio :label="2" v-if="JSON.parse(dict.modelForecast[0].value).Meteorological">中央气象台</el-radio>
          <el-radio :label="3" v-if="JSON.parse(dict.modelForecast[0].value).hefeng">和风天气</el-radio>
        </el-radio-group>
      </div>
      <div class="rc-mt">预报类型</div>
      <div class="rc-bd">
        <el-radio-group v-model="options.forecastType" @change="change">
          <el-radio v-if="options.model===1" :label="1">逐时降雨</el-radio>
          <el-radio :label="2">逐日降雨</el-radio>
          <el-radio v-if="options.model===1" :label="3">过程累计(时)</el-radio>
          <el-radio v-if="options.model===1" :label="4">过程累计(日)</el-radio>
        </el-radio-group>
      </div>
      <div class="rc-mt">显示效果</div>
      <div class="rc-bd">
        <el-checkbox v-model="options.level" @change="change">降雨等值面</el-checkbox>

      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {

  data() {
    return {

      box1: false,

      box2: false,

      options: {

        trend: false,

        model: 1,

        forecastType: 2,

        level: true,

        grid: false
      },

      dict: {}
    }
  },

  created() {

    this.dict = window.dict

    this.init()

    this.change()
  },

  methods: {

    init() {

      let lntelligentGrid = JSON.parse(this.dict.modelForecast[0].value).lntelligentGrid

      let Meteorological = JSON.parse(this.dict.modelForecast[0].value).Meteorological

      let hefeng = JSON.parse(this.dict.modelForecast[0].value).hefeng

      if (lntelligentGrid && Meteorological) {

        this.options.model = 1
      } else if (lntelligentGrid == false && Meteorological) {

        this.options.model = 2
      } else if (lntelligentGrid == false && Meteorological == false && hefeng) {

        this.options.model = 3
      }
    },

    toggle(key) {

      this[key] = !this[key]
    },

    modelChange(v) {

      if (v === 1) {

        window.mpPlugin.meteorology().clearLayer()
      }

      if (v === 2) {

        this.options.forecastType = 2
      }

      if (v === 3) {

        window.mpPlugin.meteorology().clearLayer()
      }

      this.change()
    },

    change() {

      this.$emit('change', this.options)
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .right-control {
    top: var(--panel-top, 6.25rem);
    right: var(--panel-gap, 1.25rem);
    position: absolute;
    z-index: 503;
    width: 10rem;

    .rc-box {
      margin-bottom: 1.25rem;
      border-radius: 4px;
      overflow: hidden;
      background: var(--panel-bg, rgba(0, 16, 30, 0.52));
      border: 1px solid rgba(0, 255, 246, 0.35);
      backdrop-filter: blur(8px);

      &:last-child {
        margin-bottom: 0;
      }

      &.hide {
        .rc-bd, .rc-mt {
          display: none;
        }
      }
    }

    .rc-title {
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #333;
      font-size: 16px;
      background: #00fff6;
      font-weight: bold;
      position: relative;
      cursor: pointer;

      .el-icon-d-arrow-left {
        position: absolute;
        right: 10px;
        top: 10px;
        transform: rotate(90deg);
      }
    }

    .rc-bd {
      padding: 15px 10px;
      color: #00fff6;
    }

    .rc-mt {
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: #fff;
      background: rgba(0, 255, 246, .1);
      border-top: 1px solid rgba(0, 255, 246, .2);
      border-bottom: 1px solid rgba(0, 255, 246, .2);
    }
  }
</style>
