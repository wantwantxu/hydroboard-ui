<template>
  <div class="pop-hd">
    <ul class="pop-tab">
      <li :class="{active:tabCur==='rain'}" @click="toChange('rain')">雨情信息</li>
      <li :class="{active:tabCur==='baseInfo'}" @click="toChange('baseInfo')">基本信息</li>
    </ul>
    <div class="left-bar">
      <rain ref="rain" v-if="tabCur==='rain'" :options="options"></rain>
      <base-info v-if="tabCur==='baseInfo'" :options="options"></base-info>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import Rain from '../comp/rain'
import BaseInfo from '../comp/baseInfo'

export default {
  components: {BaseInfo, Rain},
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
      tabCur: 'rain'
    }
  },
  watch: {
    options: {
      handler(v) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    
    init() {
      this.tabCur = ''
      let _this = this
      setTimeout(() => {
        _this.toChange('rain')
      }, 500);
    },
    toChange(v) {
      this.$nextTick(() => {
        this.tabCur = v
      })
    },
    handleTabClick() {

    },
    toClose() {

    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-tab {
    display: flex;
    flex-direction: row;
    margin: 10px 0 15px;

    li {
      background: rgba(0,212,255,0);
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid #00FFF6;
      cursor: pointer;
      margin-right: 5px;
      height: 30px;
      
      
      color: #00fff6;
      line-height: 30px;
      padding: 0 15px;
      
      transition: all .5s;

      &.active {
        font-size: 16px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei,sans-serif;
        font-weight: bold;
        background: #fd0;
        border-color: #fd0;
        color: #333;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
